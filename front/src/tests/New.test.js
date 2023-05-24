import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import New from '../components/News/New/index';

describe('New', () => {
  let originalWindow;
  beforeEach(() => {
    originalWindow = { ...window };
    Object.defineProperty(window, 'open', {
      value: jest.fn(() => ({ focus: jest.fn() })),
    });
  });

  afterEach(() => {
    window = originalWindow;
  });

  const newContent = {
    objectID: 1,
    story_title: 'sample_title',
    story_url: 'https://sample-url.com',
    author: 'sample_author',
    created_at: '2023-04-29T18:20:35.000Z',
  };

  test('renders correctly', () => {
    render(<New content={newContent} />);
    const newTitle = screen.getByText('sample_title');
    const newDate = screen.getByText(/hours ago/);
    expect(newTitle).toBeInTheDocument();
    expect(newDate).toBeInTheDocument();
  });

  test('opens story link when clicking on content', () => {
    render(<New content={newContent} />);
    const newContentElement = screen.getByText('sample_title');
    fireEvent.click(newContentElement);
    expect(window.open).toHaveBeenCalledWith('https://sample-url.com', '_blank');
  });

  test('adds to favorites when clicking on not favorite icon', () => {
    localStorage.setItem('favs', JSON.stringify([]));
    render(<New content={newContent} />);
    const notFavoriteIcon = screen.getByAltText('no_fav_svg');
    fireEvent.click(notFavoriteIcon);
    expect(JSON.parse(localStorage.getItem('favs'))).toEqual([newContent]);
  });

  test('removes from favorites when clicking on favorite icon', () => {
    localStorage.setItem('favs', JSON.stringify([newContent]));
    render(<New content={newContent} isFavorite />);
    const favoriteIcon = screen.getByAltText('fav_svg');
    fireEvent.click(favoriteIcon);
    expect(JSON.parse(localStorage.getItem('favs'))).toEqual([]);
  });
});
