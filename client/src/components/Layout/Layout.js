import React from 'react';
import { Container } from 'react-bootstrap';
import Header from '../Common/Header';
import Sidebar from '../Common/Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar />
      <div className="flex-grow-1">
        <Header />
        <Container fluid className="py-4">
          <Outlet />
        </Container>
      </div>
    </div>
  );
};

export default Layout;