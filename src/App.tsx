import React from 'react';
import {Outlet,Link} from 'react-router-dom';
import { Breadcrumb, Layout, Menu, theme } from 'antd';

const { Header, Content, Footer } = Layout;

const items = new Array(3).fill(null).map((_, index) => ({
  key: index + 1,
  label: `nav ${index + 1}`,
}));

function App() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items}
          style={{ flex: 1, minWidth: 0,flexDirection: 'row-reverse'}}
        />
      </Header>
      <Content style={{ padding: '0 48px' }}>
        <div style={{ height:'22px'}}></div>
        {/* <Breadcrumb style={{ margin: '16px 0' }} itemRender={itemRender} items={routerItems}>
        </Breadcrumb> */}
        <div
          style={{
            background: colorBgContainer,
            minHeight: 'calc(100vh - 200px)',
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet/>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Monitor ©{new Date().getFullYear()} Created by Monitor Server
      </Footer>
    </Layout>
  );
}

export default App;
