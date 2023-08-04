import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  message,
} from "antd";
import Search from "antd/es/input/Search";
import { ColumnsType } from "antd/es/table";
import { useState, useEffect, MouseEventHandler } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  addPackageTicket,
  fetchPackageTicket,
  updatePackageTicket,
} from "../redux/packageTicket";
import { edit } from "../assets/js";
import dayjs, { Dayjs } from "dayjs";

interface PackageTicket {
  id?: string;
  codePackage: string;
  name: string;
  dou: string;
  trd: string;
  price: string;
  priceCombo: string;
  numberTicket: number;
  status: string;
}

const PackageService = () => {
  const columns: ColumnsType<PackageTicket> = [
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
      render: (record: PackageTicket, text: any) => {
        return <span>{`${text.priceCombo}/${text.numberTicket} vé`}</span>;
      },
    },
    {
      title: "Tình trạng",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Hành động",
      key: "action",
      render: (text: any, record: PackageTicket) => (
        <Space>
          <Button
            danger
            className="border-none flex items-center"
            onClick={() => handleOpenModal(record.id)}
          >
            <img src={edit} alt="edit" width={15} height={15} />
            <p className="mx-1">Cập nhật</p>
          </Button>
        </Space>
      ),
    },
  ];
  const dispatch: any = useDispatch();
  const dataPackageTicket = useSelector(
    (state: RootState) => state.packageTicket.packageTicket
  );

  const random = Math.random().toString(36).slice(2);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState({
    codePackage: random,
    name: "",
    dou: "",
    trd: "",
    price: "",
    priceCombo: "",
    numberTicket: 0,
    status: "",
  });

  useEffect(() => {
    dispatch(fetchPackageTicket());
  }, [dispatch]);

  const handleOpenModal = (recordId: string | null = null) => {
    setSelectedRecordId(recordId);

    if (recordId) {
      const record = findRecordById(recordId);
      if (record) {
        setInputValues({
          codePackage: record.codePackage,
          name: record.name,
          dou: record.dou,
          trd: record.trd,
          price: record.price,
          priceCombo: record.priceCombo,
          numberTicket: record.numberTicket,
          status: record.status,
        });
      }
    } else {
      // If no recordId provided, reset the input values to the initial state
      setInputValues({
        codePackage: random,
        name: "",
        dou: "",
        trd: "",
        price: "",
        priceCombo: "",
        numberTicket: 0,
        status: "",
      });
    }

    setIsOpenModal(true);
  };

  const closeModal = () => {
    setIsOpenModal(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleDateChange = (
    name: string,
    date: Dayjs | null,
    dateString: string
  ) => {
    if (!date) {
      date = dayjs(dateString, "DD/MM/YY HH:mm");
    }

    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: dateString,
    }));
  };

  const handleSelectChange = (value: string) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      status: value,
    }));
  };

  const handleAddData: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();
    const newTicket = { ...inputValues };
    try {
      if (!newTicket.name) {
        message.error("Vui lòng nhập tên gói vé !!!");
        return;
      }
      await dispatch(addPackageTicket(newTicket));
      message.success("Thêm thiết bị thành công !!!");
      closeModal();
      setInputValues({
        codePackage: "",
        name: "",
        dou: "",
        trd: "",
        price: "",
        priceCombo: "",
        numberTicket: 0,
        status: "",
      });
    } catch (error) {
      message.error(`Lỗi khi thêm thiết bị: ${error}`);
    }
  };

  const findRecordById = (id: string) => {
    return dataPackageTicket.find((record) => record.id === id);
  };

  const handleUpdateData: MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    event.preventDefault();
    const updatedTicket = { ...inputValues };
    try {
      if (!updatedTicket.name) {
        message.error("Vui lòng nhập tên gói vé !!!");
        return;
      }

      if (!selectedRecordId) {
        message.error("Không có ID gói vé được chọn để cập nhật !!!");
        return;
      }

      await dispatch(
        updatePackageTicket({ id: selectedRecordId, updatedTicket })
      );
      message.success("Cập nhật gói vé thành công !!!");
      closeModal();
    } catch (error) {
      message.error(`Lỗi khi cập nhật gói vé: ${error}`);
    }
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
              <Button danger onClick={() => handleOpenModal()}>
                Thêm gói vé
              </Button>
            </Space>
          </div>
        </div>
        <div className="pt-4">
          <Table
            size="small"
            columns={columns}
            dataSource={dataPackageTicket}
            className="table-striped-rows"
            rowKey={(record: PackageTicket) => record.codePackage}
            pagination={{ pageSize: 3 }}
          ></Table>
        </div>
      </div>

      <Modal
        open={isOpenModal}
        footer={false}
        closeIcon={false}
        onCancel={closeModal}
      >
        <div className="text-center add-title">
          {selectedRecordId ? "Cập nhật gói vé" : "Thêm gói vé"}
        </div>
        <Form layout="vertical" className="pt-2">
          <div className="w-2/4">
            <Form.Item
              label={
                <p>
                  Tên gói vé <span className="red">*</span>
                </p>
              }
              className="mb-2"
            >
              <Input
                onChange={handleInputChange}
                value={inputValues.name}
                name="name"
              ></Input>
            </Form.Item>
          </div>
          <div className="flex items-center justify-between">
            <Form.Item label="Ngày áp dụng" className="mb-2">
              <DatePicker
                name="dou"
                format={"DD/MM/YY HH:mm"}
                onChange={(date, dateString) =>
                  handleDateChange("dou", date, dateString)
                }
              />
            </Form.Item>

            <Form.Item label="Ngày hết hạn" className="mb-2">
              <DatePicker
                name="trd"
                format={"DD/MM/YY HH:mm"}
                onChange={(date, dateString) =>
                  handleDateChange("trd", date, dateString)
                }
              />
            </Form.Item>
          </div>
          <div>
            <Form.Item label="Giá vé áp dụng" className="mb-2">
              <span>
                <Space>
                  <Checkbox></Checkbox>
                  Vé lẻ {"(vnđ/vé)"} với giá
                  <Input
                    className="w-24"
                    name="price"
                    placeholder="Giá vé"
                    onChange={handleInputChange}
                    value={inputValues.price}
                  ></Input>
                  {"/vé"}
                </Space>
              </span>
            </Form.Item>
            <Form.Item className="mb-2">
              <span>
                <Space>
                  <Checkbox></Checkbox>
                  Combo vé với giá
                  <Input
                    className="w-24"
                    name="priceCombo"
                    placeholder="Giá vé"
                    onChange={handleInputChange}
                    value={inputValues.priceCombo}
                  ></Input>
                  {"/"}
                  <Input
                    className="w-12"
                    name="numberTicket"
                    placeholder="vé"
                    onChange={handleInputChange}
                    value={inputValues.numberTicket}
                  ></Input>
                  {"/vé"}
                </Space>
              </span>
            </Form.Item>
            <div className="w-1/3">
              <Form.Item label="Tình trạng">
                <Select
                  defaultValue="Đang áp dụng"
                  options={[
                    { value: "Đang áp dụng", label: "Đang áp dụng" },
                    { value: "Tắt", label: "Tắt" },
                  ]}
                  data-name="status"
                  onChange={handleSelectChange}
                  value={inputValues.status}
                />
              </Form.Item>
            </div>
          </div>
          <footer className="text-center">
            <Space>
              <Button danger className="w-32 h-10" onClick={closeModal}>
                Hủy
              </Button>
              <button
                className="comparison"
                onClick={selectedRecordId ? handleUpdateData : handleAddData}
              >
                <span className="btn-compar">
                  {selectedRecordId ? "Cập nhật" : "Lưu"}
                </span>
              </button>
            </Space>
          </footer>
        </Form>
      </Modal>
    </div>
  );
};

export default PackageService;
