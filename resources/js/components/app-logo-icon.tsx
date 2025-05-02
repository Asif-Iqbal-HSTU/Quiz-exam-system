import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <>
            <img
                {...props}
                src="/logo/barc_logo.jpg"
                alt="BARC Logo"
            />
        </>
    );
}
