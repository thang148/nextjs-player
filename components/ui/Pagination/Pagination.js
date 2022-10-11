import s from "./Pagination.module.css"
import cn from "classnames"
import { Fragment } from "react"

function getList(start, total) {
  let list = []
  let index = 0
  if (start > 1) {
    index = 1
  }
  if (start > 2) {
    index = 2
  }
  const max = start + 4 - index > total ? total : start + 4 - index
  for (let i = start - index; i <= max; i++) {
    list.push(i)
  }
  return list
}

export default function Pagination({ onChange, pagination }) {
  const { total, page_size, page_num } = pagination
  const _count = Math.ceil(total / page_size)
  const list = getList(page_num, _count)
  function onChangePageNumber(index) {
    onChange(index)
  }

  return (
    <Fragment>
      {_count > 1 && (
        <div className="flex justify-center p-4">
          <ul className="flex space-x-2">
            <li className={cn(s.li, { [s.disable]: page_num === 1 })}>
              <div
                className={cn("flex justify-center items-center h-full", { ["cursor-not-allowed"]: page_num === 1 })}
                role="button"
                tabIndex="0"
                onKeyDown={() => onChangePageNumber(page_num - 1)}
                onClick={() => onChangePageNumber(page_num - 1)}
              >
                {left}
              </div>
            </li>

            {list.map((item) => {
              return (
                <li className={cn(s.li, { [s.active]: page_num === item })} key={item}>
                  <div
                    className="flex justify-center items-center h-full"
                    role="button"
                    tabIndex="0"
                    onKeyDown={() => onChangePageNumber(item)}
                    onClick={() => onChangePageNumber(item)}
                  >
                    {item}
                  </div>
                </li>
              )
            })}

            <li className={cn(s.li, { [s.disable]: page_num === Math.ceil(total / page_size) })}>
              <div
                className={cn("flex justify-center items-center h-full", {
                  ["cursor-not-allowed"]: page_num === list.length
                })}
                role="button"
                tabIndex="0"
                onKeyDown={() => onChangePageNumber(page_num + 1)}
                onClick={() => onChangePageNumber(page_num + 1)}
              >
                {right}
              </div>
            </li>
          </ul>
        </div>
      )}
    </Fragment>
  )
}

const right = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
  </svg>
)
const left = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
  </svg>
)
