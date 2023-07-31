import Search from "antd/es/input/Search";
import { bell, mail, test } from "../assets/js";

// interface Props {
//   onSearch: any;
// }

const Header = () => {
  return (
    <div className="flex justify-between items-center p-4 w-full">
      <div>
        <Search placeholder="Search"></Search>
      </div>
      <div className="flex gap-2">
        <img src={mail} alt="mail" width={24} height={24} />
        <img src={bell} alt="bell" width={24} height={24} />
        <img src={test} alt="" width={24} height={24} />
      </div>
    </div>
  );
};

export default Header;
