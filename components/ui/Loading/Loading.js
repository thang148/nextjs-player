import s from "./Loading.module.css"

export default function Loading({ loading, children }) {
  return (
    <>
      {loading && (
        <div className="absolute flex justify-center z-10 inset-0 rounded">
          <div className={s.ldsRoller}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
      {children}
    </>
  )
}
