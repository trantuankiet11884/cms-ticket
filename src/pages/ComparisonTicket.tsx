import {
  Button,
  Col,
  DatePicker,
  Radio,
  RadioChangeEvent,
  Row,
  Space,
  Table,
} from "antd";
import Search from "antd/es/input/Search";
import { ColumnsType } from "antd/es/table";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { fetchComparisionTicket } from "../redux/comparisonTicket";

interface ComparisionTicket {
  stt: string;
  codeTicket: string;
  dou: string;
  name: string;
  gate: string;
  isComparision: boolean;
}

const columns: ColumnsType<ComparisionTicket> = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "stt",
  },
  {
    title: "Số vé",
    dataIndex: "codeTicket",
    key: "codeTicket",
  },
  {
    title: "Ngày sử dụng",
    dataIndex: "dou",
    key: "dou",
  },
  {
    title: "Tên loại vé",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Cổng check-in",
    dataIndex: "gate",
    key: "gate",
  },
  {
    title: "",
    dataIndex: "isComparision",
    key: "isComparision",
    render: (record: ComparisionTicket) => (
      <span>
        {record.isComparision ? (
          <span>Đã đối soát</span>
        ) : (
          <span>Chưa đối soát</span>
        )}
      </span>
    ),
  },
];

const ComparisonTicket = () => {
  const [value, setValue] = useState(1);
  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  const dispatch: any = useDispatch();
  const dataCpTicket = useSelector(
    (state: RootState) => state.cpTicket.comparision
  );

  useEffect(() => {
    dispatch(fetchComparisionTicket());
  }, [dispatch]);
  return (
    <div className="h-full">
      <Row className="h-full">
        <Col span={17}>
          <div className="p-4 pt-0 h-full">
            <div className="bg-white h-full p-2 rounded-lg">
              <p className="title ">Đối soát vé</p>
              <div className="flex justify-between pt-4">
                <div>
                  <Search placeholder="Search"></Search>
                </div>
                <div>
                  <button className="comparison">
                    <span className="btn-compar">Chốt đối soát</span>
                  </button>
                </div>
              </div>
              <div className="pt-4">
                <Table columns={columns} dataSource={dataCpTicket}></Table>
              </div>
            </div>
          </div>
        </Col>
        <Col span={7}>
          <div className="p-4 pt-0 h-full">
            <div className="bg-white h-full p-2 rounded-lg">
              <p className="title">Lọc vé</p>
              <div>
                <Row>
                  <Col span={12}>
                    <p>Tình trạng đối soát</p>
                  </Col>
                  <Col span={12}>
                    <Radio.Group className="" onChange={onChange} value={value}>
                      <Radio value={1}>Tất cả</Radio>
                      <Radio value={2}>Đã đối soát</Radio>
                      <Radio value={3}>Chưa đối soát</Radio>
                    </Radio.Group>
                  </Col>
                </Row>
              </div>
              <div className="pt-4 ">
                <Row>
                  <Col span={12}>
                    <p>Loại vé</p>
                  </Col>
                  <Col span={12}>
                    <p>Vé cổng</p>
                  </Col>
                </Row>
              </div>
              <div className="pt-4">
                <Row>
                  <Col span={12}>Từ ngày</Col>
                  <Col span={12}>
                    <DatePicker></DatePicker>
                  </Col>
                </Row>
                <Row className="py-3">
                  <Col span={12}>Đến ngày</Col>
                  <Col span={12}>
                    <DatePicker></DatePicker>
                  </Col>
                </Row>
              </div>
              <div className="text-center pt-4">
                <Button danger>Lọc</Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ComparisonTicket;
