import React from 'react';
import { shallow } from 'enzyme';
import { Navbar } from './Navbar';

//Setup
let wrapper = shallow(<Navbar />);

//Test
describe('Navbar component', () => {
  it('renders the Navbar Component correctly', () => {   
    expect(wrapper)
    .toMatchSnapshot();
  });
  it('confirms that searchbar is empty', () => {   
    expect(wrapper.find('.searchbar').text())
    .toBe('');
  });
  it('ensures the Subreddit title rendered correctly', () => {   
    expect(wrapper.find('header').text())
    .toBe('Subreddits');
  });

});