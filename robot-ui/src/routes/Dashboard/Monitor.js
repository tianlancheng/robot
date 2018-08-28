import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Card,
  List,
  Tag,
  Row,
  Col,
  Icon,
} from 'antd';

import styles from './Monitor.less';

@connect(({ monitor, loading }) => ({
  monitor,
  loading: loading.models.monitor,
}))
export default class Monitor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hosts: {},
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'monitor/getHosts',
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.monitor) {
      this.state.hosts = nextProps.monitor.hosts;
    }
  }

  addMonitor = (id) => {
    console.log('addMonitor');
    this.props.dispatch({
      type: 'monitor/addMonitor',
      params: {
        ip: id,
      },
    });
  }

  deleteMonitor = (id) => {
    console.log('deleteMonitor');
    this.props.dispatch({
      type: 'monitor/deleteMonitor',
      params: {
        ip: id,
      },
    });
  }

  deleteHost = (id) => {
    console.log('deleteHost');
    this.props.dispatch({
      type: 'monitor/deleteHost',
      id,
    });
  }

  details = (id) => {
    this.props.dispatch(routerRedux.push('/dashboard/container', { 'hostid': id }));
  }

  render() {
    const { hosts } = this.state;
    const { loading } = this.props;
    return (
      <div className={styles.cardList}>
        <List
          rowKey="id"
          loading={loading}
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={hosts}
          renderItem={item => (
            <List.Item key={item._id}>
              <Card
                hoverable
                className={styles.card}
                actions={[item.isMonitor ?
                  <a onClick={(ev) => { this.deleteMonitor(item._id); }}>取消监视</a>
                  : <a onClick={(ev) => { this.addMonitor(item._id); }}>加入监视</a>,
                  <a onClick={(ev) => { this.deleteHost(item._id); }}>删除主机</a>]}
              >
                <Card.Meta
                  onClick={(ev) => { this.details(item._id); }}
                  avatar={(
                    <div className={styles.divAvatar}>
                      <img alt="" className={styles.cardAvatar} src="/static/headPic/computer.png" />
                      <div>{item._id}</div>
                      <div><Tag color={item.status === 'running' ? '#87d068' : '#faad14'}>{item.status}</Tag></div>
                    </div>
                  )}
                  title={<div><span className={styles.hostname}>{item.hostname}</span>{item.isMonitor ? <Icon className={styles.icon} type="eye" /> : ''}</div>}
                  description={
                    <div>
                      <Row>
                        <Col span={12}>cpu数：{item.cpu.count}</Col>
                        <Col span={12}>使用率： {item.cpu.percent}</Col>
                      </Row>
                      <Row>
                        <Col span={12}>内存：{item.memory.total}</Col>
                        <Col span={12}>使用率：{item.memory.percent}</Col>
                      </Row>
                      <Row>
                        <Col span={24}>容器数量：{item.containerNum}</Col>
                      </Row>
                    </div>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      </div>
    );
  }
}
