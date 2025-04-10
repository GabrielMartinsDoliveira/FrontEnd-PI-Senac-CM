import './HeaderStyle.css'
import logo from '../../assets/imgs/Logo-forenSeek.jpg';

const Header = () => {
  return (
    <>
      <section>
        <img
          src={logo}
          alt="Logo do aplicativo ForenSeek"
        />
        <p>Opções</p>
      </section>
    </>
  );
};

export default Header;
