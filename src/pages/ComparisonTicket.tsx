import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { fetchComparisionTicket } from "../redux/comparisonTicket";
import {
  Button,
  Col,
  DatePicker,
  Radio,
  RadioChangeEvent,
  Row,
  Table,
} from "antd";
import Search from "antd/es/input/Search";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { Dayjs } from "dayjs";
import { firestore } from "../firebase/config";

interface ComparisionTicket {
  id: string;
  codeTicket: string;
  dou: firebase.firestore.Timestamp;
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
    render: (text: any, record: ComparisionTicket) => {
      const douTimestamp = record.dou as firebase.firestore.Timestamp;
      const douDate = moment(douTimestamp.toMillis()).format("DD/MM/YYYY");
      return <span>{douDate}</span>;
    },
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
    render: (isComparision: boolean) =>
      isComparision ? (
        <span className="comparision">Đã đối soát</span>
      ) : (
        <span className="iscomparision">Chưa đối soát</span>
      ),
  },
];

const ComparisonTicket = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isComparision, setIsComparision] = useState<string>("");
  const [filteredData, setFilteredData] = useState<ComparisionTicket[]>([]);
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);

  const dispatch: any = useDispatch();
  const dataCpTicket = useSelector(
    (state: RootState) => state.cpTicket.comparision
  );

  useEffect(() => {
    dispatch(fetchComparisionTicket());
  }, [dispatch]);

  useEffect(() => {
    setFilteredData(dataCpTicket);
  }, [dataCpTicket]);

  const onRadioChange = (e: RadioChangeEvent, value: string) => {
    setSearchValue(e.target.value);
    setIsComparision(e.target.value);
  };

  const onChangeFromDate = (date: Dayjs | null, dateString: string) => {
    setFromDate(date);
  };

  const onChangeToDate = (date: Dayjs | null, dateString: string) => {
    setToDate(date);
  };

  const handleFilterData = () => {
    let filteredData = dataCpTicket;

    if (fromDate && toDate) {
      filteredData = filteredData.filter(
        (item) =>
          item.dou.toMillis() >= fromDate.startOf("day").valueOf() &&
          item.dou.toMillis() <= toDate.endOf("day").valueOf()
      );
    }

    if (isComparision !== "" && isComparision !== "all") {
      filteredData = filteredData.filter(
        (item) => item.isComparision === (isComparision === "true")
      );
    }

    setFilteredData(filteredData);
  };

  const handleComparision = async () => {
    try {
      const idsToUpdate = filteredData
        .filter((item) => !item.isComparision)
        .map((item) => item.id);

      if (idsToUpdate.length > 0) {
        const batch = firestore.batch();
        const cpticketRef = firestore.collection("comparisionTicket");

        idsToUpdate.forEach((id) => {
          const docRef = cpticketRef.doc(id);
          batch.update(docRef, { isComparision: true });
        });

        await batch.commit();

        const updatedData = filteredData.map((item) =>
          idsToUpdate.includes(item.id)
            ? { ...item, isComparision: true }
            : item
        );
        setFilteredData(updatedData);
      }
    } catch (error) {
      console.error("Error updating comparision status:", error);
    }
  };

  return (
    <div className="h-full">
      <Row className="h-full">
        <Col span={17}>
          <div className="p-4 pt-0 h-full">
            <div className="bg-white h-full p-2 rounded-lg">
              <p className="title">Đối soát vé</p>
              <div className="flex justify-between pt-4">
                <div>
                  <Search
                    placeholder="Search"
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </div>
                <div>
                  <button className="comparison" onClick={handleComparision}>
                    <span className="btn-compar">Chốt đối soát</span>
                  </button>
                </div>
              </div>
              <div className="pt-4">
                <Table
                  size="small"
                  columns={columns}
                  dataSource={filteredData}
                  rowKey={(record: ComparisionTicket) => record.id}
                  className="table-striped-rows"
                ></Table>
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
                    <Radio.Group
                      onChange={(e: RadioChangeEvent) =>
                        onRadioChange(e, searchValue)
                      }
                      value={searchValue}
                      defaultValue={"all"}
                    >
                      <Radio value={"all"} checked={true}>
                        Tất cả
                      </Radio>
                      <Radio value={"true"}>Đã đối soát</Radio>
                      <Radio value={"false"}>Chưa đối soát</Radio>
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
                    <DatePicker
                      value={fromDate}
                      onChange={onChangeFromDate}
                    ></DatePicker>
                  </Col>
                </Row>
                <Row className="py-3">
                  <Col span={12}>Đến ngày</Col>
                  <Col span={12}>
                    <DatePicker
                      value={toDate}
                      onChange={onChangeToDate}
                    ></DatePicker>
                  </Col>
                </Row>
              </div>
              <div className="text-center pt-4">
                <Button danger onClick={handleFilterData}>
                  Lọc
                </Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ComparisonTicket;
