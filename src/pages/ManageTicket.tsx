import {
  Badge,
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Modal,
  Radio,
  RadioChangeEvent,
  Row,
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
import { firestore } from "../firebase/config";

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
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModal2, setIsOpenModal2] = useState(false);
  const [isOpenModal3, setIsOpenModal3] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<DataType | null>(null);
  const [selectedEventTicket, setSelectedEventTicket] =
    useState<DataType | null>(null);
  const [updatedUsageDate, setUpdatedUsageDate] = useState<Dayjs | null>(null);
  const [updatedUsageEventDate, setUpdatedUsageEventDate] =
    useState<Dayjs | null>(null);
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

  const dispatch: any = useDispatch();
  const dataTicket = useSelector((state: RootState) => state.ticket.tickets);
  const dataTicketEvent = useSelector(
    (state: RootState) => state.ticketEvent.ticketEvents
  );

  useEffect(() => {
    dispatch(fetchTickets());
    dispatch(fetchEventTickets());
  }, [dispatch]);
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
                  <button
                    className="dotdot"
                    onClick={() => handleTicketUsage(record.id)}
                  >
                    Sử dụng vé
                  </button>
                  <button
                    className="dotdot"
                    onClick={() => handleOpenModal2(record.id)}
                  >
                    Đổi ngày sử dụng
                  </button>
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
            trigger="click"
            placement="left"
            title={
              <>
                <div className="flex flex-col justify-start items-start">
                  <button
                    className="dotdot"
                    onClick={() => handleEventTicketUsage(record.id)}
                  >
                    Sử dụng vé
                  </button>
                  <button
                    className="dotdot"
                    onClick={() => handleOpenModal3(record.id)}
                  >
                    Đổi ngày sử dụng
                  </button>
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

  const handleOpenModal2 = (ticketId: string) => {
    setSelectedTicket(
      filteredData.find((item) => item.id === ticketId) || null
    );
    setIsOpenModal2(true);
    setUpdatedUsageDate(null);
  };

  const handleOpenModal3 = (ticketId: string) => {
    setSelectedEventTicket(
      filteredDataEvent.find((item) => item.id === ticketId) || null
    );
    setIsOpenModal3(true);
    setUpdatedUsageEventDate(null);
  };

  const closeModal2 = () => {
    setIsOpenModal2(false);
  };

  const closeModal3 = () => {
    setIsOpenModal3(false);
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

  const handleTicketUsage = (ticketId: any) => {
    markTicketAsUsed(ticketId);
  };

  const handleEventTicketUsage = (ticketId: any) => {
    markEventTicketAsUsed(ticketId);
  };

  const handleExport = () => {
    const exportt =
      changeTable === true
        ? exportToExcel(filteredData, "family")
        : exportToExcel(filteredDataEvent, "event");
  };

  const markTicketAsUsed = async (ticketId: any) => {
    try {
      const ticketRef = firestore.collection("manageTicket").doc(ticketId);
      const ticketSnapshot = await ticketRef.get();
      const ticketData = ticketSnapshot.data();

      if (updatedUsageDate) {
        await ticketRef.update({
          status: "Đã sử dụng",
          dou: firebase.firestore.Timestamp.fromMillis(
            updatedUsageDate.valueOf()
          ),
        });
      } else {
        await ticketRef.update({
          status: "Đã sử dụng",
        });
      }
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };

  const markEventTicketAsUsed = async (ticketId: any) => {
    try {
      const ticketRef = firestore.collection("manageEventTicket").doc(ticketId);
      const ticketSnapshot = await ticketRef.get();
      const ticketData = ticketSnapshot.data();

      if (updatedUsageEventDate) {
        await ticketRef.update({
          status: "Đã sử dụng",
          dou: firebase.firestore.Timestamp.fromMillis(
            updatedUsageEventDate.valueOf()
          ),
        });
      } else {
        await ticketRef.update({
          status: "Đã sử dụng",
        });
      }
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
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
        open={isOpenModal3}
        footer={false}
        closeIcon={false}
        onCancel={closeModal3}
      >
        {selectedEventTicket && (
          <>
            <p className="text-center">Đổi ngày sử dụng vé</p>
            <Row className="pt-5">
              <Col span={8}>
                <p>Số vé:</p>
                <p>Tên vé:</p>
                <p>Tên sự kiện:</p>
                <p>Hạn sử dụng:</p>
              </Col>
              <Col span={16}>
                <p>{selectedEventTicket.bookingCode}</p>
                <p>{selectedEventTicket.numberTicket}</p>
                <p>{selectedEventTicket.nameEvent || "-"}</p>
                <p>
                  <DatePicker
                    value={updatedUsageEventDate}
                    onChange={(date: Dayjs | null) =>
                      setUpdatedUsageEventDate(date)
                    }
                    format={"DD/MM/YYYY"}
                  />
                </p>
              </Col>
            </Row>
            <div className="text-center pt-5">
              <Space>
                <Button danger onClick={() => setIsOpenModal3(false)}>
                  Hủy
                </Button>
                <Button
                  className="bg-[#ff993c] text-[white]"
                  onClick={() => {
                    markEventTicketAsUsed(selectedEventTicket?.id);
                    setIsOpenModal3(false);
                  }}
                >
                  Lưu
                </Button>
              </Space>
            </div>
          </>
        )}
      </Modal>

      <Modal
        open={isOpenModal2}
        footer={false}
        closeIcon={false}
        onCancel={closeModal2}
      >
        {selectedTicket && (
          <>
            <p className="text-center">Đổi ngày sử dụng vé</p>
            <Row className="pt-5">
              <Col span={8}>
                <p>Số vé:</p>
                <p>Tên vé:</p>
                <p>Tên sự kiện:</p>
                <p>Hạn sử dụng:</p>
              </Col>
              <Col span={16}>
                <p>{selectedTicket.bookingCode}</p>
                <p>{selectedTicket.numberTicket}</p>
                <p>{selectedTicket.nameEvent || "-"}</p>
                <p>
                  <DatePicker
                    value={updatedUsageDate}
                    onChange={(date: Dayjs | null) => setUpdatedUsageDate(date)}
                    format={"DD/MM/YYYY"}
                  />
                </p>
              </Col>
            </Row>
            <div className="text-center pt-5">
              <Space>
                <Button danger onClick={() => setIsOpenModal2(false)}>
                  Hủy
                </Button>
                <Button
                  className="bg-[#ff993c] text-[white]"
                  onClick={() => {
                    markTicketAsUsed(selectedTicket?.id);
                    setIsOpenModal2(false);
                  }}
                >
                  Lưu
                </Button>
              </Space>
            </div>
          </>
        )}
      </Modal>

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
