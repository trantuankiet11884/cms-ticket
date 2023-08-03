import {
  Badge,
  Button,
  Checkbox,
  DatePicker,
  Modal,
  Radio,
  RadioChangeEvent,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import Search from "antd/es/input/Search";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { fetchTickets } from "../redux/manageTicket";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import moment from "moment";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { Dayjs } from "dayjs";
import { fetchEventTickets } from "../redux/manageTicket/manageEventTicket";
import { elips } from "../assets/js";
import { exportToExcel } from "../utils/export";

interface DataType {
  id: string;
  bookingCode: string;
  numberTicket: string;
  status: string;
  dou: firebase.firestore.Timestamp;
  trd: firebase.firestore.Timestamp;
  gate: string;
  nameEvent?: string;
}

interface ManageEventTicket {
  category: string;
  id: string;
  bookingCode: string;
  numberTicket: string;
  status: string;
  dou: firebase.firestore.Timestamp;
  trd: firebase.firestore.Timestamp;
  gate: string;
  nameEvent: string;
}

const ManageTicket = () => {
  const dispatch: any = useDispatch();
  const dataTicket = useSelector((state: RootState) => state.ticket.tickets);
  const dataTicketEvent = useSelector(
    (state: RootState) => state.ticketEvent.ticketEvents
  );

  useEffect(() => {
    dispatch(fetchTickets());
    dispatch(fetchEventTickets());
  }, [dispatch]);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [disabledGateCheckboxes, setDisabledGateCheckboxes] = useState(false);
  const [value, setValue] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedGates, setSelectedGates] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<DataType[]>([]);
  const [filteredDataEvent, setFilteredDataEvent] = useState<
    ManageEventTicket[]
  >([]);
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);
  const [changeTable, setChangeTable] = useState(false);

  useEffect(() => {
    setFilteredData(dataTicket);
    setFilteredDataEvent(dataTicketEvent);
  }, [dataTicket, dataTicketEvent]);

  const columns: ColumnsType<DataType> = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
    },
    {
      title: "Booking code",
      dataIndex: "bookingCode",
      key: "bookingCode",
    },
    {
      title: "Số vé",
      dataIndex: "numberTicket",
      key: "numberTicket",
    },
    {
      title: "Tình trạng sử dụng",
      dataIndex: "status",
      key: "status",
      render: (text: string, record: DataType) => {
        switch (record.status) {
          case "Đã sử dụng":
            return (
              <Tag color="#EAF1F8">
                <Space>
                  <Badge status="default"></Badge>
                  <span className="used">Đã sử dụng</span>
                </Space>
              </Tag>
            );
          case "Chưa sử dụng":
            return (
              <Tag color="#DEF7E0">
                <Space>
                  <Badge status="success"></Badge>
                  <span className="unused">Chưa sử dụng</span>
                </Space>
              </Tag>
            );
          default:
            return (
              <Tag color="#F8EBE8">
                <Space>
                  <Badge status="error"></Badge>
                  <span className="expiry">Hết hạn</span>
                </Space>
              </Tag>
            );
        }
      },
    },
    {
      title: "Ngày sử dụng",
      dataIndex: "dou",
      key: "dou",
      render: (text: any, record: DataType) => {
        const douTimestamp = record.dou as firebase.firestore.Timestamp;
        const douDate = moment(douTimestamp.toMillis()).format("DD/MM/YYYY");
        return <span>{douDate}</span>;
      },
    },
    {
      title: "Ngày xuất vé",
      dataIndex: "trd",
      key: "trd",
      render: (text: any, record: DataType) => {
        const trdTimestamp = record.trd as firebase.firestore.Timestamp;
        const trdDate = moment(trdTimestamp.toMillis()).format("DD/MM/YYYY");
        return <span>{trdDate}</span>;
      },
    },
    {
      title: "Cổng check-in",
      dataIndex: "gate",
      key: "gate",
    },
    {
      title: "",
      render: (record) => {
        return (
          <Tooltip
            color="#FFD2A8"
            trigger="click"
            placement="left"
            title={
              <>
                <div className="flex flex-col justify-start items-start">
                  <button className="dotdot">Sử dụng vé</button>
                  <button className="dotdot">Đổi ngày sử dụng</button>
                </div>
              </>
            }
          >
            <img src={elips} alt="selected" />
          </Tooltip>
        );
      },
    },
  ];

  const columnsEvent: ColumnsType<ManageEventTicket> = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
    },
    {
      title: "Booking code",
      dataIndex: "bookingCode",
      key: "bookingCode",
    },
    {
      title: "Số vé",
      dataIndex: "numberTicket",
      key: "numberTicket",
    },
    {
      title: "Tên sự kiện",
      dataIndex: "nameEvent",
      key: "nameEvent",
    },
    {
      title: "Tình trạng sử dụng",
      dataIndex: "status",
      key: "status",
      render: (text: string, record: ManageEventTicket) => {
        switch (record.status) {
          case "Đã sử dụng":
            return (
              <Tag color="#EAF1F8">
                <Space>
                  <Badge status="default"></Badge>
                  <span className="used">Đã sử dụng</span>
                </Space>
              </Tag>
            );
          case "Chưa sử dụng":
            return (
              <Tag color="#DEF7E0">
                <Space>
                  <Badge status="success"></Badge>
                  <span className="unused">Chưa sử dụng</span>
                </Space>
              </Tag>
            );
          default:
            return (
              <Tag color="#F8EBE8">
                <Space>
                  <Badge status="error"></Badge>
                  <span className="expiry">Hết hạn</span>
                </Space>
              </Tag>
            );
        }
      },
    },
    {
      title: "Ngày sử dụng",
      dataIndex: "dou",
      key: "dou",
      render: (text: any, record: DataType) => {
        const douTimestamp = record.dou as firebase.firestore.Timestamp;
        const douDate = moment(douTimestamp.toMillis()).format("DD/MM/YYYY");
        return <span>{douDate}</span>;
      },
    },
    {
      title: "Ngày xuất vé",
      dataIndex: "trd",
      key: "trd",
      render: (text: any, record: DataType) => {
        const trdTimestamp = record.trd as firebase.firestore.Timestamp;
        const trdDate = moment(trdTimestamp.toMillis()).format("DD/MM/YYYY");
        return <span>{trdDate}</span>;
      },
    },
    {
      title: "Cổng check-in",
      dataIndex: "gate",
      key: "gate",
    },
    {
      title: "",
      render: (record) => {
        return (
          <Tooltip
            color="#FFD2A8"
            placement="left"
            title={
              <>
                <div className="flex flex-col justify-start items-start">
                  <button className="dotdot">Sử dụng vé</button>
                  <button className="dotdot">Đổi ngày sử dụng</button>
                </div>
              </>
            }
          >
            <img src={elips} alt="selected" />
          </Tooltip>
        );
      },
    },
  ];

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const closeModal = () => {
    setIsOpenModal(false);
  };

  const onChangeFromDate = (date: Dayjs | null) => {
    setFromDate(date);
  };

  const onChangeToDate = (date: Dayjs | null) => {
    setToDate(date);
  };

  const onChange = (e: RadioChangeEvent, value: string) => {
    setValue(e.target.value);
    setSelectedStatus(e.target.value);
  };

  const onChangeGate = (e: CheckboxChangeEvent) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    if (value === "Tất cả") {
      setDisabledGateCheckboxes(isChecked);
      setSelectedGates(isChecked ? ["Tất cả"] : []);
    } else {
      setSelectedGates((prevGates) => {
        if (isChecked) {
          return [...prevGates, value];
        } else {
          return prevGates.filter((gate) => gate !== value);
        }
      });

      setSelectedGates((prevGates) =>
        prevGates.includes("Tất cả")
          ? prevGates.filter((gate) => gate !== "Tất cả")
          : prevGates
      );
    }
  };

  const handleSubmitModal = () => {
    setIsOpenModal(false);
    let filteredData = dataTicket;
    let filteredDataEvents = dataTicketEvent;
    if (fromDate && toDate) {
      filteredData = filteredData.filter(
        (item) =>
          item.dou.toMillis() >= fromDate.startOf("day").valueOf() &&
          item.dou.toMillis() <= toDate.endOf("day").valueOf()
      );

      filteredDataEvents = filteredDataEvents.filter(
        (item) =>
          item.dou.toMillis() >= fromDate.startOf("day").valueOf() &&
          item.dou.toMillis() <= toDate.endOf("day").valueOf()
      );
    }

    if (selectedStatus !== "" && selectedStatus !== "Tất cả") {
      filteredData = filteredData.filter(
        (item) => item.status === selectedStatus
      );
      filteredDataEvents = filteredDataEvents.filter(
        (item) => item.status === selectedStatus
      );
    }

    if (selectedGates.length > 0 && !selectedGates.includes("Tất cả")) {
      filteredData = filteredData.filter((item) =>
        selectedGates.includes(item.gate)
      );
      filteredDataEvents = filteredDataEvents.filter((item) =>
        selectedGates.includes(item.gate)
      );
    }

    setFilteredData(filteredData);
    setFilteredDataEvent(filteredDataEvents);
  };

  const handleExport = () => {
    const exportt =
      changeTable === true
        ? exportToExcel(filteredData, "family")
        : exportToExcel(filteredDataEvent, "event");
  };

  return (
    <div className="p-4 pt-0 h-full">
      <div className="bg-white h-full p-2 rounded-lg">
        <p className="title">Danh sách vé</p>

        <div className="change-table">
          <Space>
            <Button
              ghost
              className="btn-change"
              onClick={(e) => setChangeTable(true)}
            >
              Gói gia đình
            </Button>
            <Button
              ghost
              className="btn-change"
              onClick={(e) => setChangeTable(false)}
            >
              Gói sự kiện
            </Button>
          </Space>
        </div>
        <div className="flex justify-between pt-4">
          <div>
            <Search placeholder="Search"></Search>
          </div>
          <div>
            <Space>
              <Button danger onClick={handleOpenModal}>
                Lọc vé
              </Button>
              <Button danger onClick={handleExport}>
                Xuất file {`(.csv)`}
              </Button>
            </Space>
          </div>
        </div>
        <div className="pt-4">
          {changeTable === true ? (
            <Table
              size="small"
              columns={columns}
              dataSource={filteredData}
              rowKey={(record: DataType) => record.id}
              className="table-striped-rows"
            ></Table>
          ) : (
            <Table
              size="small"
              columns={columnsEvent}
              dataSource={filteredDataEvent}
              rowKey={(record: ManageEventTicket) => record.id}
              className="table-striped-rows"
            ></Table>
          )}
        </div>
      </div>

      <Modal
        open={isOpenModal}
        footer={false}
        closeIcon={false}
        onCancel={closeModal}
      >
        <div className="modal-title">
          <p>Lọc vé</p>
        </div>
        <section className="modal-content">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <p>Từ ngày</p>
              <DatePicker value={fromDate} onChange={onChangeFromDate} />
            </div>
            <div className="flex flex-col">
              <p>Đến ngày</p>
              <DatePicker value={toDate} onChange={onChangeToDate} />
            </div>
          </div>
          <div className="flex flex-col pt-4">
            <div>
              <p className="modal-content__title">Tình trạng sử dụng</p>
            </div>
            <div>
              <Radio.Group
                className="flex justify-between"
                onChange={(e: RadioChangeEvent) => onChange(e, value)}
                value={value}
              >
                <Radio value={"Tất cả"}>Tất cả</Radio>
                <Radio value={"Đã sử dụng"}>Đã sử dụng</Radio>
                <Radio value={"Chưa sử dụng"}>Chưa sử dụng</Radio>
                <Radio value={"Hết hạn"}>Hết hạn</Radio>
              </Radio.Group>
            </div>
          </div>
          <div className="flex flex-col pt-4">
            <div>
              <p className="modal-content__title">Cổng check-in</p>
            </div>
            <div className="checkbox-container">
              <div className="checkbox-item">
                <Checkbox onChange={onChangeGate} value="Tất cả">
                  Tất cả
                </Checkbox>
              </div>
              <div className="checkbox-item">
                <Checkbox
                  onChange={onChangeGate}
                  value="Cổng 1"
                  disabled={disabledGateCheckboxes}
                >
                  Cổng 1
                </Checkbox>
              </div>
              <div className="checkbox-item">
                <Checkbox
                  onChange={onChangeGate}
                  value="Cổng 2"
                  disabled={disabledGateCheckboxes}
                >
                  Cổng 2
                </Checkbox>
              </div>
              <div className="checkbox-item">
                <Checkbox
                  onChange={onChangeGate}
                  value="Cổng 3"
                  disabled={disabledGateCheckboxes}
                >
                  Cổng 3
                </Checkbox>
              </div>
              <div className="checkbox-item">
                <Checkbox
                  onChange={onChangeGate}
                  value="Cổng 4"
                  disabled={disabledGateCheckboxes}
                >
                  Cổng 4
                </Checkbox>
              </div>
              <div className="checkbox-item">
                <Checkbox
                  onChange={onChangeGate}
                  value="Cổng 5"
                  disabled={disabledGateCheckboxes}
                >
                  Cổng 5
                </Checkbox>
              </div>
            </div>
          </div>
        </section>
        <div className="modal-footer text-center pt-4">
          <Button danger onClick={handleSubmitModal} className="w-20">
            Lọc
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ManageTicket;
