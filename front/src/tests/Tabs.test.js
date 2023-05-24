/* eslint-disable testing-library/prefer-screen-queries */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Tabs from '../components/Tabs/index';

describe('Tabs', () => {
  it('should call the tabChanged function with the correct argument when clicking on "All"', () => {
    const tabChanged = jest.fn();
    const { getByText } = render(<Tabs tabChanged={tabChanged} />);
    const allTab = getByText('All');
    fireEvent.click(allTab);
    expect(tabChanged).toHaveBeenCalledTimes(1);
    expect(tabChanged).toHaveBeenCalledWith('all');
  });

  it('should call the tabChanged function with the correct argument when clicking on "My faves"', () => {
    const tabChanged = jest.fn();
    const { getByText } = render(<Tabs tabChanged={tabChanged} />);
    const myFavesTab = getByText('My faves');
    fireEvent.click(myFavesTab);
    expect(tabChanged).toHaveBeenCalledWith('my-faves');
  });

  it('should highlight the "All" tab by default', () => {
    const tabChanged = jest.fn();
    const { getByText } = render(<Tabs tabChanged={tabChanged} />);
    const allTab = getByText('All');
    const myFavesTab = getByText('My faves');
    expect(allTab).toHaveStyle({ border: 'solid 1px #1797ff' });
    expect(myFavesTab).toHaveStyle({ border: 'solid 1px #d6d6d6' });
  });

  it('should highlight the "My faves" tab when clicked', () => {
    const tabChanged = jest.fn();
    const { getByText } = render(<Tabs tabChanged={tabChanged} />);
    const myFavesTab = getByText('My faves');
    fireEvent.click(myFavesTab);
    const allTab = getByText('All');
    expect(myFavesTab).toHaveStyle({ border: 'solid 1px #1797ff' });
    expect(allTab).toHaveStyle({ border: 'solid 1px #d6d6d6' });
  });
});
