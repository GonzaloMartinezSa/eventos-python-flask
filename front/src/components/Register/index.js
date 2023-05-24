import { useState } from 'react';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// auth
import FormProvider from '../utils/auth/FormProvider';
import RHFTextField from '../utils/auth/RHFTextField';
import Iconify from '../utils/iconify/Iconify';
import { Container } from './styles';
// components

// ----------------------------------------------------------------------

export default function Register() {

  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    // firstName: Yup.string().required('First name required'),
    // lastName: Yup.string().required('Last name required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
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

      console.log(data.username, data.email, data.password);

      const response = await fetch(`http://localhost:5000/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          'username': data.username,
          'email': data.email,
          'password': data.password
        })
      });

      const data2 = await response.json();
      console.log(data2)
      handleRedirect()
    } catch (error) {
      console.error(error);

      reset();

      setError('afterSubmit', {
        ...error,
        message: error.message || error,
      });
    }
  };

  const handleRedirect = () => {
    window.location.href = '/login'
  };

  return (
    <Container>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2.5}>
          {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

          {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <RHFTextField name="firstName" label="First name" />
            <RHFTextField name="lastName" label="Last name" />
          </Stack> */}

          <RHFTextField name="username" label="Username" />

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

          <LoadingButton
            fullWidth
            color="inherit"
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting || isSubmitSuccessful}
            sx={{
              bgcolor: 'text.primary',
              color: 'common.white',
              '&:hover': {
                bgcolor: 'text.primary',
                color: 'common.white',
              },
            }}
          >
            Registrarse
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Container>
  );
}
