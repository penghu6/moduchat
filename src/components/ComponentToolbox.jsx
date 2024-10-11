import React from 'react';
import { Card, Tabs } from 'antd';
import SystemComponent from './SystemComponent';
import UserComponent from './UserComponent';
import Animation from './AnimationSelector';

const { TabPane } = Tabs;

const ComponentToolbox = () => {
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
            <Card type="inner">
              <div>
                <Animation />
              </div>
            </Card>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ComponentToolbox;