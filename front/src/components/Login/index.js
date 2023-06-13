import { useState } from 'react';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, Alert, IconButton, InputAdornment, Button, Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../utils/iconify/index';
import FormProvider from '../utils/auth/FormProvider';
import { Container } from './styles';
import RHFTextField from '../utils/auth/RHFTextField';
import { useLocation } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function Login(props) {

  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const currentPath = useLocation().pathname;

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`http://localhost:5000/users/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          'username': data.email,
          'password': data.password
        })
      });

      const responseData = await response.json();
      console.log(responseData);

      if(response.status === 200) {
        // login successful!  
        props.setToken(responseData.access_token)
        localStorage.setItem('user_id', responseData.user.id)
        handleRedirectToIndex()
      } else if(response.status === 401) {
        // login failed!
        setLoginError(true);
        console.error(responseData.message);
        reset();
        setError('afterSubmit', {
          message: responseData.message,
        });
      }
      else{
        document.cookie = `session=${data.session}; path=/`;
      }

    } catch (error) {
      console.error(error);
      reset();
      setError('afterSubmit', {
        ...error,
        message: error.message || error,
      });
    }
  };

  const handleRedirectToIndex = () => {
    window.location.href = '/'
  };

  const handleRedirectToRegister = () => {
    window.location.href = '/register'
  };

  if (currentPath === '/register') return (<></>);

  return (
    <Container>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

          <RHFTextField name="email" label="Email address" />

          <RHFTextField
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        {/*<Stack alignItems="flex-end" sx={{ my: 2 }}>
        <Link
          component={NextLink}
          href={PATH_AUTH.resetPassword}
          variant="body2"
          color="inherit"
          underline="always"
        >
          Forgot password?
        </Link>
        </Stack>*/}
        
        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={(isSubmitSuccessful || isSubmitting) && !loginError}
          sx={{
            bgcolor: 'text.primary',
            color: 'common.white',
            marginTop: '30px',
            width: '60%',
            '&:hover': {
              bgcolor: 'text.primary',
              color: 'common.white',
            },
          }}
        >
          Login
        </LoadingButton>
      </FormProvider>
      <Divider
        sx={{
          my: 2.5,
          typography: 'overline',
          color: 'text.disabled',
          '&::before, ::after': {
            borderTopStyle: 'dashed',
          },
        }}
      >
        O
      </Divider>

      <Button
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        onClick={handleRedirectToRegister}
        sx={{
          bgcolor: 'text.primary',
          color: 'common.white',
          width: '60%',
          '&:hover': {
            bgcolor: 'text.primary',
            color: 'common.white',
          },
        }}
      >
        Registrarse
      </Button>
    </Container>
  );
}
