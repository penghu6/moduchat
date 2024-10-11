import React from 'react';
import { Tooltip, Row, Col } from 'antd';
import * as Icons from '@ant-design/icons';

const SystemComponent = () => {
  const systemIcons = [
    'DashboardOutlined', 'UserOutlined', 'SettingOutlined', 'MailOutlined',
    'CalendarOutlined', 'FileOutlined', 'BarChartOutlined', 'PictureOutlined',
    'VideoCameraOutlined', 'CustomerServiceOutlined', 'EnvironmentOutlined', 'CloudOutlined',
    'SafetyOutlined', 'HeartOutlined', 'ShoppingCartOutlined', 'QuestionOutlined'
  ];

  return (
    <Row gutter={[16, 16]}>
      {systemIcons.map((iconName, index) => {
        const IconComponent = Icons[iconName];
        return (
          <Col span={6} key={index}>
            <Tooltip title={iconName.replace('Outlined', '')}>
              <IconComponent style={{ fontSize: '24px' }} />
            </Tooltip>
          </Col>
        );
      })}
    </Row>
  );
};

export default SystemComponent;
