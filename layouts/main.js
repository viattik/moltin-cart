import React from 'react';
import Cart from 'components/cart';
import 'styles/core.scss';

const MainLayout = (props) => (
  <div className="container-fluid">
    <Cart />
    {props.children}
  </div>
);

export default MainLayout;
