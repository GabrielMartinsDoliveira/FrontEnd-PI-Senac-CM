import "./HeaderStyle.css";
import logo from "../../assets/imgs/ForenSeek2 1.png";

const Header = () => {
  return (
    <header>
      <section>
        <img src={logo} alt="Logo do aplicativo ForenSeek" />
      </section>
    </header>
  );
};

export default Header;
