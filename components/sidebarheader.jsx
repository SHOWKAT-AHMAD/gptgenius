import {SiOpenaigym} from 'react-icons/si'
import Themetoggle from './Themetoggle'

const Sidebarheader = () => {
  return (
      <div className='flex items-center mb-4 gap-4 px-4 '>
        <SiOpenaigym className='w-10 h-10 text-primary'/>
        <h2 className='text-xl font-extrabold text-primary mr-auto'>GPTGenius</h2>
        <Themetoggle/>
      </div>
  )
}

export default Sidebarheader