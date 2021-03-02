import TopNav from '../components/TopNav';

export default function MainLayout(props) {
  return (
    <>
      <TopNav />
      {props.children}
    </>
)};