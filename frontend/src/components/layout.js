import { Layout, Menu } from 'antd';
import Link from 'next/link';

function LayoutForm({ children }) {
  const { Header, Content, Footer, Sider } = Layout;

  return (
    <div>
      <Layout style={{ height: '100vh' }}>
        <Header className="header" style={{ color: 'white' }}>
          Kakao style
        </Header>
        <Layout>
          <Sider width={200}>
            <Menu mode="inline" defaultSelectedKeys={['1']} style={{ height: '100%', borderRight: 0 }}>
              <Menu.Item key="1">
                <Link href="/admin">Creator</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link href="/admin/outbox"> Out Box </Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link href="/admin/inbox"> In Box </Link>
              </Menu.Item>
              <Menu.Item key="4">
                <Link href="/admin/archive"> Archive </Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              {children}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
}

export default LayoutForm;
