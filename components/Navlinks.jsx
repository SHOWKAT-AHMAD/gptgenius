'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
    {href:'/chat', label:'chat'},
    {href:'/tours', label:'tours'},
    {href:'/tours/new-tour', label:'new tour'},
    {href:'/profile', label:'profile'},
]

const Navlinks = () => {
  const pathname = usePathname();
  const isActive =(path)=>pathname===path;

  return (
    <ul className="menu text-base-content bg-base-200 rounded-box w-auto ">
        {links.map((link)=>{
            return <li className={isActive(link.href)?"capitalize active font-bold bg-base-300 rounded-box ":"hover:scale-105 hover:text-secondary "} key={link.label}>
                <Link href={link.href} className="capitalize" >
                {link.label}
                </Link>
            </li>
        })}
    </ul>
  )
}

export default Navlinks