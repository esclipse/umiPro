import React from 'react';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

class SlidingTabsDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'top',
      activeKey: '0',
    };
  }

  onChange = activeKey => {
    this.props.handleChangeTopic(Object.keys(this.props.localmsg)[activeKey]);
    this.setState({ activeKey });
  };

  render() {
    const { mode } = this.state;
    const { localmsg } = this.props;
    const code = undefined;
    return (
      <div>
        <Tabs defaultActiveKey="0" tabPosition={mode} style={{ height: 400, overflow: 'auto' }} onChange={this.onChange} activeKey={this.state.activeKey}>
          {Object.keys(localmsg).map((v, i) => (
            <TabPane tab={v} key={i}>
                <img className="disabledDrag" src={`https://login.weixin.qq.com/qrcode/${code}`} />
                {
                  localmsg[v].map(({username, msg}, i) => {
                    return(
                      <div key={i}>username: {username} msg: {msg}</div>
                    )
                  })
                }
            </TabPane>
          ))}
        </Tabs>
      </div>
    );
  }
}

export default SlidingTabsDemo;