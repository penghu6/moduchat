import React from 'react';
import { Card, Tabs } from 'antd';
import SystemComponent from './system-component';
import UserComponent from './user-component';
import Animation from './animation';

const { TabPane } = Tabs;

const Right = () => {
  return (
    <div>
      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane tab="组件预览" key="1">
            <Card type="inner" title="系统组件">
              <SystemComponent />
            </Card>
            <Card type="inner" title="用户组件" style={{ marginTop: 16 }}>
              <UserComponent />
            </Card>
          </TabPane>
          <TabPane tab="动画效果" key="2">
            <Card type="inner" >
              <div >
                <Animation />
              </div>
            </Card>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Right;