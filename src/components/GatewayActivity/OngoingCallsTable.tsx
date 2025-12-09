import { useTable, usePagination } from "react-table";
import { FC } from "react";
import { OngoingCallsTableProps } from "../Cards/card";

const OngoingCallsTable: FC<OngoingCallsTableProps> = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    pageOptions,
    gotoPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
    },
    usePagination
  );

  return (
    <div>
      <table
        id="ongoing-calls-table"
        {...getTableProps()}
        className="w-full cursor-default"
      >
        <thead className="text-xs bg-app-gray-3  font-normal text-white">
          {headerGroups.map((headerGroup, i) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  key={column.id}
                  className={`${
                    i === 0
                      ? "text-left font-normal py-[8px] px-2"
                      : "font-normal py-[8px] "
                  }`}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="text-xs ">
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                key={i}
                className="hover:bg-app-gray-6"
              >
                {row.cells.map((cell, j) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      key={j}
                      className={`py-[8px] ${j === 0 ? "pl-2" : "pl-0"}`}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex justify-end text-sm mb-3">
        <div className="gap-1 flex">
          {createPagination(pageIndex, pageOptions, gotoPage)}
        </div>
      </div>
    </div>
  );
};

const createPagination = (
  pageIndex: number,
  pageOptions: number[],
  gotoPage: any
) => {
  // const upperLimit = pageIndex >= 2 ? [0, 1] : pageIndex == 1 ? [] : [0,1];
  const upperLimit = pageIndex + 1 >= pageOptions.length ? [] : [0, 1];
  const lowerLimit = pageIndex >= 2 ? [1, 0] : pageIndex == 1 ? [0] : [];

  return (
    <div className="flex gap-1">
      {lowerLimit.map((ele, index) => (
        <button onClick={() => gotoPage(pageIndex - ele - 1)} key={index}>
          {pageIndex - ele}
        </button>
      ))}

      <button className={`text-app-blue`}>{pageIndex + 1}</button>

      {upperLimit.map((ele, index) => (
        <button
          onClick={() => gotoPage(pageIndex + ele + 2 - 1)}
          key={index}
        >
          {pageIndex + ele + 2}
        </button>
      ))}
      {pageOptions.length - pageIndex > 3 ? (
        <div className="flex gap-">
          {pageOptions.length - pageIndex !== 4 ? (
            <button className="text-app-blue">...</button>
          ) : null}
          <button onClick={() => gotoPage(pageOptions.length - 1)}>
            {pageOptions.length}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default OngoingCallsTable;
