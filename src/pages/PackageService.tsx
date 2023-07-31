import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  RadioChangeEvent,
  Select,
  Space,
  Table,
  TimePicker,
} from "antd";
import Search from "antd/es/input/Search";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";

interface DataType {
  id: string;
  stt: string;
  codePackage: string;
  name: string;
  dou: string;
  trd: string;
  price: string;
  priceCombo: string;
  status: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "stt",
  },
  {
    title: "Mã gói",
    dataIndex: "codePackage",
    key: "codePackage",
  },
  {
    title: "Tên gói vé",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Tình trạng sử dụng",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Ngày áp dụng",
    dataIndex: "dou",
    key: "dou",
  },
  {
    title: "Ngày hết hạn",
    dataIndex: "trd",
    key: "trd",
  },
  {
    title: "Giá vé (VND/Vé)",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Giá Combo (VNĐ/Combo)",
    dataIndex: "priceCombo",
    key: "priceCombo",
  },
  {
    title: "Tình trạng",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Hành động",
    key: "action",
    render: (text: any, record: DataType) => (
      <Space>
        <Button>Cập nhật</Button>
      </Space>
    ),
  },
];

const PackageService = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };
  const closeModal = () => {
    setIsOpenModal(false);
  };
  const handleSubmitModal = () => {
    setIsOpenModal(false);
  };

  return (
    <div className="p-4 pt-0 h-full">
      <div className="bg-white h-full p-2 rounded-lg">
        <p className="title">Danh sách gói vé</p>
        <div className="flex justify-between pt-4">
          <div>
            <Search placeholder="Search"></Search>
          </div>
          <div>
            <Space>
              <Button danger>Xuất file {`(.csv)`}</Button>
              <Button danger onClick={handleOpenModal}>
                Thêm gói vé
              </Button>
            </Space>
          </div>
        </div>
        <div className="pt-4">
          <Table></Table>
        </div>
      </div>

      <Modal
        open={isOpenModal}
        footer={false}
        closeIcon={false}
        onCancel={closeModal}
      >
        <div className="text-center">Thêm gói vé</div>
        <Form layout="vertical" className="pt-2">
          <div className="w-2/4">
            <Form.Item>
              <p className="pb-2">
                Tên gói vé <span className="red">*</span>
              </p>
              <Input></Input>
            </Form.Item>
          </div>
          <div className="flex items-center justify-between">
            <Form.Item label="Ngày áp dụng">
              <DatePicker format={"DD/MM/YY HH:mm:ss"}></DatePicker>
            </Form.Item>

            <Form.Item label="Ngày hết hạn">
              <DatePicker format={"DD/MM/YY HH:mm:ss"}></DatePicker>
            </Form.Item>
          </div>
          <div>
            <Form.Item label="Giá vé áp dụng">
              <Checkbox></Checkbox>&nbsp;&nbsp;
              <span>
                <Space>
                  Vé lẻ {"(vnđ/vé)"} với giá
                  <Input className="w-24" placeholder="Giá vé"></Input>
                  {"/vé"}
                </Space>
              </span>
            </Form.Item>
            <Form.Item>
              <Checkbox></Checkbox>&nbsp;&nbsp;
              <span>
                <Space>
                  Combo vé với giá
                  <Input className="w-24" placeholder="Giá vé"></Input>
                  {"/"}
                  <Input className="w-12" placeholder="vé"></Input>
                  {"/vé"}
                </Space>
              </span>
            </Form.Item>
            <div className="w-1/3">
              <Form.Item label="Tình trạng">
                <Select
                  defaultValue="Đang áp dụng"
                  options={[
                    { value: "true", label: "Đang áp dụng" },
                    { value: "false", label: "Tắt" },
                  ]}
                />
              </Form.Item>
            </div>
          </div>
          <footer className="text-center">
            <Space>
              <Button danger className="w-32 h-10" onClick={closeModal}>
                Hủy
              </Button>
              <button className="comparison" onClick={handleSubmitModal}>
                <span className="btn-compar">Lưu</span>
              </button>
            </Space>
          </footer>
        </Form>
      </Modal>
    </div>
  );
};

export default PackageService;
