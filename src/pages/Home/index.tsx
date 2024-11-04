import { useEffect, useState } from "preact/hooks"
import { makeRequest } from "../../lib/utils"
import { useUserContext } from "../../lib/hooks/useUserContext"
import { AppTable } from "../../components/AppTable"
import "./style.css"

export function Home() {
  const [availableLoans, setAvailableLoans] = useState([])
  const [availableSIPs, setAvailableSIPs] = useState([])
  const [availableFunds, setAvailableFunds] = useState([])

  const { logoutUser } = useUserContext()

  useEffect(() => {
    const loans = makeRequest("/fiuofferings/bytype/loan", "GET")
    const sips = makeRequest("/fiuofferings/bytype/sip", "GET")
    const funds = makeRequest("/fiuofferings/bytype/fund", "GET")

    Promise.all([loans, sips, funds])
      .then((responses) => {
        responses[0].json().then((data) => {
          console.log(data)
          setAvailableLoans(data)
        })
        responses[1].json().then((data) => {
          console.log(data)
          setAvailableSIPs(data)
        })
        responses[2].json().then((data) => {
          console.log(data)
          setAvailableFunds(data)
        })
      })
      .catch((error) => {
        console.error(error)
        logoutUser()
      })
  }, [])

  return (
    <div class="home">
      <div class="button-bar">
        <button>
          <a href="/addoffering?type=loan">+ Loan Offering</a>
        </button>
        <button>
          <a href="/addoffering?type=sip">+ SIP Offering</a>
        </button>
        <button>
          <a href="/addoffering?type=fund">+ Mutual Fund Offering</a>
        </button>
      </div>
      <div class="existing">
        <h2>Existing Offerings</h2>
        <AppTable
          title="Loans"
          data={availableLoans}
          columns={["title", "loanAmount", "loanTenure", "interestRate"]}
        />
        <AppTable
          title="SIPs"
          data={availableSIPs}
          columns={["title", "sipAmount", "sipTenure", "sipFrequency"]}
        />
        <AppTable
          title="Mutual Funds"
          data={availableFunds}
          columns={["title", "fundType", "fundAmount", "fundTenure"]}
        />
      </div>
    </div>
  )
}
