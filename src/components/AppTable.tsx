import "./apptable.style.css"

export function AppTable({
  title,
  data,
  columns,
}: {
  title: string
  data: any[]
  columns: string[]
}) {
  return (
    <div class="table-container">
      <h2>{title}</h2>
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            return (
              <tr>
                {columns.map((column) => (
                  <td>{row.details[column]}</td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
