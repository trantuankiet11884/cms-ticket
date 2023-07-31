import {
  Button,
  Checkbox,
  DatePicker,
  Modal,
  Radio,
  RadioChangeEvent,
  Space,
  Table,
} from "antd";
import Search from "antd/es/input/Search";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { fetchTickets } from "../redux/manageTicket";
import { CheckboxChangeEvent } from "antd/es/checkbox";

interface DataType {
  id: string;
  stt: string;
  bookingCode: string;
  numberTicket: string;
  status: string;
  dou: string;
  trd: string;
  gate: string;
  nameEvent?: string;
}

const ManageTicket = () => {
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
    },
    {
      title: "Ngày sử dụng",
      dataIndex: "dou",
      key: "dou",
    },
    {
      title: "Ngày xuất vé",
      dataIndex: "trd",
      key: "trd",
    },
    {
      title: "Cổng check-in",
      dataIndex: "gate",
      key: "gate",
    },
  ];
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [value, setValue] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedGate, setSelectedGate] = useState<string>("");
  const [filteredData, setFilteredData] = useState<DataType[]>([]);

  const dispatch: any = useDispatch();
  const dataTicket = useSelector((state: RootState) => state.ticket.tickets);

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  useEffect(() => {
    setFilteredData(dataTicket);
  }, [dataTicket]);

  const onChange = (e: RadioChangeEvent, value: string) => {
    setValue(e.target.value);
    setSelectedStatus(e.target.value);
  };

  const onChangeGate = (e: CheckboxChangeEvent) => {
    setSelectedGate(e.target.checked ? e.target.value : "");
  };

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const closeModal = () => {
    setIsOpenModal(false);
  };

  const handleSubmitModal = () => {
    setIsOpenModal(false);
    let filteredData = dataTicket;
    if (selectedStatus !== "" && selectedStatus !== "Tất cả") {
      filteredData = filteredData.filter(
        (item) => item.status === selectedStatus
      );
    }
    if (selectedGate !== "" && selectedGate !== "Tất cả") {
      filteredData = filteredData.filter((item) => item.gate === selectedGate);
    }
    setFilteredData(filteredData);
  };

  return (
    <div className="p-4 pt-0 h-full">
      <div className="bg-white h-full p-2 rounded-lg">
        <p className="title">Danh sách vé</p>
        <div className="change-table">
          <Space>
            <Button ghost className="btn-change">
              Gói gia đình
            </Button>
            <Button ghost className="btn-change">
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
              <Button danger>Xuất file {`(.csv)`}</Button>
            </Space>
          </div>
        </div>
        <div className="pt-4">
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey={(record: DataType) => record.id}
          ></Table>
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
              <DatePicker />
            </div>
            <div className="flex flex-col">
              <p>Đến ngày</p>
              <DatePicker />
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
                <Checkbox onChange={onChangeGate} value="Cổng 1">
                  Cổng 1
                </Checkbox>
              </div>
              <div className="checkbox-item">
                <Checkbox onChange={onChangeGate} value="Cổng 2">
                  Cổng 2
                </Checkbox>
              </div>
              <div className="checkbox-item">
                <Checkbox onChange={onChangeGate} value="Cổng 3">
                  Cổng 3
                </Checkbox>
              </div>
              <div className="checkbox-item">
                <Checkbox onChange={onChangeGate} value="Cổng 4">
                  Cổng 4
                </Checkbox>
              </div>
              <div className="checkbox-item">
                <Checkbox onChange={onChangeGate} value="Cổng 5">
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
