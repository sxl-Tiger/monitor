import React, { useEffect, useState } from 'react'

import { Space, Table, Col, Row,Button, Form, type FormProps, Input,DatePicker } from 'antd';
import type {GetProp, TableProps,DatePickerProps,GetProps} from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Line } from '@ant-design/charts';

import locale from 'antd/es/date-picker/locale/zh_CN';

type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;
interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

interface areaDataType {
  time?: number | string;
  value?: number | string;
}

interface FieldType {
  name?: string;
  time?: Array<any>;
  startTime?: string;
  endTime?: string;
};

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

const { RangePicker } = DatePicker;

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'msg',
    dataIndex: 'msg',
    key: 'msg',
  },
  {
    title: 'info',
    dataIndex: 'info',
    key: 'info',
  },
  {
    title: 'uid',
    dataIndex: 'uid',
    key: 'uid',
  },
  // {
  //   title: 'Action',
  //   key: 'action',
  //   render: (_, record) => (
  //     <Space size="middle">
  //       <a>Invite {record.name}</a>
  //       <a>Delete</a>
  //     </Space>
  //   ),
  // },
];

const Detail: React.FC = () => {
  const[ search] = useSearchParams();
  const id = search.get('id') || ''
  const [data, setData] = useState<DataType[]>([]) 
  const [areaData, setAreaData] = useState<areaDataType[]>([])
  const [pageOption, setPageOption] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0
  })
  const [time, setTime] = useState<RangePickerProps['value']>([null,null])
  const paginationProps = {
    showQuickJumper: true,
    showTotal: () => `共${pageOption.total}条`,
    total: pageOption.total,
    current: pageOption.current,
    pageSize: pageOption.pageSize,
    onChange: (current: number, size:number) => paginationChange(current, size)
  }
  const paginationChange = (current: number, size: number) => {
    codeData({},{ ...pageOption ,current, pageSize:size})
  }
  const onChange = (value: RangePickerProps['value'], dateString:any) => {

  }
  const config = {
    title: '今昨日监控图',
    padding: [20, 20, 20, 20], 
    data:areaData,
    point: {
      visible: true,
      size: 3,
      style: {
        fill: 'white',
        stroke: '#2593fc',
        lineWidth: 2,
      },
    },
    xField: 'date',
    yField: 'value',
    annotations: [
      {
        type: "lineY",
        yField: 5,
        style: { stroke: "#F4664A", strokeOpacity: 1, lineWidth: 1 },
      }
    ],
    legend: {
      color: {
        layout: {
          justifyContent: 'center',
          alignItems: 'flex-end',
          flexDirection: 'column',
        },
      },
    },
    label: {
      lineHeight:30,
      position: 'bottom',
      transform: [{ type: 'overlapHide' }],
      textAlign:'center',
      textBaseline:'bottom'
    },
    axis: {
      x: {
        title:'时间(小时)',
        line:true,
        arrow:true,
        lineArrowOffset:10
      },
      y: {
        title:'数量(个)',
        line:true,
        arrow:true,
        lineArrowOffset:30
      },
    },
    tooltip: {
      title: (d:any) => `${d.date}点`,
      items:[{channel: 'y'}]
    },
    colorField:'type',
    scale: { 
      color: { range: ['#2593fc','#FAA219' ] },
      x: { 
        type: 'linear',
        tickCount:24
      }
    },
  };
  const codeData =(res:FieldType={},pageInfo:TablePaginationConfig = pageOption) => {
    let url = `http://localhost:3000/api/monitor?id=${id}&size=${pageInfo.pageSize}&page=${pageInfo.current}`
    Object.entries(res).filter(ele => ele[1]).forEach((item,index) => {
      if (item[1]) {
        url += `&${item[0]}=${item[1]}`
      }
    })
    fetch(url,{
        method: "get",
      }).then(res => res.json())
      .then(ele => { // 服务器返回给客户端的数据
        setAreaData( ele.data.line)
        setData(ele.data.list)
        setPageOption({
          current: pageInfo.current,
          pageSize: Number(pageInfo.pageSize),
          total: ele.data.total,
        })
        
      }).catch(error => {
        return error
      })
  }
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    let data = {
      ...values,
      startTime: values.time ? values.time[0].format('YYYY-MM-DD HH:mm') : '',
      endTime: values.time ? values.time[1].format('YYYY-MM-DD HH:mm') : '',
    }
    delete data.time
    
    codeData(data)
  };
  useEffect( () => {
    let timer = setTimeout(() => {
      codeData()
    })
    return () => {
      clearTimeout(timer)
    }
  }, []);
  return(
    <>
    <div style={{'border': '1px solid #000', 'padding': '0 24px','marginBottom':'24px'}} >
      <Line {...config} onlyChangeData={true} />
    </div>
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item<FieldType>
            label="info信息"
            name="name"
            rules={[{ required: false, message: '' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item<FieldType>
            label="时间"
            name="time"
            rules={[{ required: false, message: '' }]}
          >
            <RangePicker
              locale={locale}
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              onChange={onChange}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
        </Col>
      </Row>
      
    </Form>
    <Table columns={columns} dataSource={data} pagination={paginationProps}/>
    </>
   
  )
}

export default Detail


