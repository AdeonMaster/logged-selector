import { path, identity } from 'ramda';

import createLoggedSelector from '../';

const simpleSelector = createLoggedSelector(
  'simpleSelector',
  path(['items']),
  identity
);

describe('simple selector', () => {
  const mockedState = {
    items: [
      'First',
      'Second'
    ]
  };

  it('should return items', () => {
    const result = simpleSelector(mockedState);

    expect(result).toEqual(mockedState.items);
  });
});
