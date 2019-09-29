import { Component } from 'react';
import { Layout, Icon, message } from 'antd';
import SiderMenu from "../components/SiderMenu/SiderMenu";
import { getMenuData } from '../common/menu';
import logo from '../assets/logo.svg';
import GlobalHeader from "../components/GlobalHeader";
import gql from "graphql-tag";
import { ApolloProvider } from 'react-apollo';
import Login from '../pages/user/Login';
import client from '../client';
import CurrentUser from '../components/CurrentUser';
const { Content, Header, Footer } = Layout;

class BasicLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    };
  }
  
  handleMenuCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    const { children, location } = this.props;
    const { collapsed } = this.state;
    return (
      <ApolloProvider client={client}>
      <CurrentUser>
          {currentUser=>{
              console.log(currentUser)
              return currentUser? 
              <Layout>
          <SiderMenu
            logo={logo}
            collapsed={collapsed}
            menuData={getMenuData()}
            location={location}
            onCollapse={this.handleMenuCollapse}
          />
          <Layout>
            <Header style={{ padding: 0 }}>
              <GlobalHeader
                logo={logo}
                collapsed={collapsed}
                currentUser={{
                  name: 'Serati Ma',
                  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
                  userid: '00000001',
                  notifyCount: 12,
                }}
                onCollapse={this.handleMenuCollapse}
              />
            </Header>
            <Content style={{ margin: '24px 24px 0', height: '100%' }}>
              { children }
            </Content>
            {/* <Footer> 0xWallet by lcj</Footer> */}
          </Layout>
          </Layout> 
              : <Login />
          }}
      </CurrentUser>
      </ApolloProvider>
    );
  }
}

export default BasicLayout;

