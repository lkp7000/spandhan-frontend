import classNames from 'classnames'
import { APP_NAME } from '@/constants/app.constant'
import type { CommonProps } from '@/@types/common'

interface LogoProps extends CommonProps {
    type?: 'full' | 'streamline'
    mode?: 'light' | 'dark'
    imgClass?: string
    logoWidth?: number | string
}

const LOGO_SRC_PATH = '/img/logo/'

const Logo = (props: LogoProps) => {
    const {
        type = 'full',
        mode = 'light',
        className,
        imgClass,
        style,
        logoWidth = 'auto',
    } = props

    return (
        <div
            className={classNames('logo', className)}
            style={{
                ...style,
                ...{ width: logoWidth },
            }}
        >
             {/* <img
      className={imgClass}
      src={`${LOGO_SRC_PATH}logo-${mode}-${type}.png`}
      alt={`${APP_NAME}`}
    /> */}
     <span className=" text-black text-[150%] text-center font-bold">
        {APP_NAME}
      </span>
        </div>
    )
}

export default Logo