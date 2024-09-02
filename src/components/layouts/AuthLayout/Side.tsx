import { cloneElement } from 'react'
import Avatar from '@/components/ui/Avatar'
import Logo from '@/components/template/Logo'
import { APP_NAME } from '@/constants/app.constant'
import type { CommonProps } from '@/@types/common'

interface SideProps extends CommonProps {
    content?: React.ReactNode
}

const Side = ({ children, content, ...rest }: SideProps) => {
    return (
        <div className="grid lg:grid-cols-3 h-full ">
            <div
                // className="bg-no-repeat bg-cover py-6 px-16 flex-col justify-between hidden lg:flex bg-gradient-to-b from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% ..."
                className="bg-no-repeat bg-cover py-6 px-16 flex-col justify-between hidden lg:flex bg-blue-600 "
                // className="bg-gradient-to-b from-green-400 to-blue-500  hover:from-pink-500 hover:to-yellow-500 ..."

                style={
                    {
                        // backgroundImage: `url('/img/others/auth-side-bg.jpg')`,
                    }
                }
            >
                {/* <Logo mode="dark" /> */}
                <div>
                    <div className="mb-6 flex items-center gap-4">
                        {/* <Avatar
                            className="border-2 border-white"
                            shape="circle"
                            src="/img/avatars/thumb-10.jpg"
                        />
                        <div className="text-white">
                            <div className="font-semibold text-base">
                                Brittany Hale
                            </div>
                            <span className="opacity-80">CTO, Onward</span>
                        </div> */}
                    </div>
                    <p className="text-3xl text-white opacity-100 flex justify-center items-center w-full h-[70vh]">
                        Spandan
                    </p>
                </div>
                <span className="text-white">
                    Copyright &copy; {`${new Date().getFullYear()}`}{' '}
                    <span className="font-semibold">{`Gigatorb Software`}</span>{' '}
                </span>
            </div>
            <div className="col-span-2 flex flex-col justify-center items-center bg-white dark:bg-gray-800">
                <div className="xl:min-w-[450px] px-8">
                    <div className="mb-8">{content}</div>
                    {children
                        ? cloneElement(children as React.ReactElement, {
                              ...rest,
                          })
                        : null}
                </div>
            </div>
        </div>
    )
}

export default Side
