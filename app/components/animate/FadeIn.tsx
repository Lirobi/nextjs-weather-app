import React, { useEffect, useState } from "react"

const FadeIn = ({
  children,
}: {
  children: JSX.Element | JSX.Element[] | string
}) => {
  const [animate, setAnimate] = useState("opacity-0 translate-y-0")

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
    setAnimate("opacity-100 translate-y-10")
  }, []);

  return (
    <div className={`transition-all ease-out duration-500 ${animate}`}>
      {children}
    </div>
  )
}

export default FadeIn