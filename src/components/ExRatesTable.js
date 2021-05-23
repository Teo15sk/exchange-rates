import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import "../scss/ExRatesTable.scss";

export function ExRatesTable() {
    const [exchangeRates, setExchangeRates] = useState([]);
    const [useDb, setuseDb] = useState(false);

    async function fetchExchangeRates() {
        const response = await fetch(`/api/v1/exchangerates?usedb=${useDb}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-type": "application/json",
            },
        });
        let data = null;
        try {
            data = await response.json();
            setExchangeRates(data);
            console.log(data);
        } catch (err) {
            console.error(err);
            return;
        }
    }

    useEffect(() => {
        fetchExchangeRates();
    }, []);

    return (
        <div>
            <h2 className="er-heading">Tabulka směnných kurzů</h2>
            <table className="er-table">
                <thead>
                    <tr>
                        <th>Země</th>
                        <th>Měna</th>
                        <th>Množství</th>
                        <th>Kód</th>
                        <th>Nákup</th>
                        <th>Prodej</th>
                        <th>Střed</th>
                        <th>Kurz ČNB</th>
                        <th>Změna v %</th>
                    </tr>
                </thead>
                <tbody>
                    {exchangeRates &&
                        exchangeRates.map((exchangeRate, index) => {
                            return (
                                <tr key={index}>
                                    <td>{exchangeRate.country}</td>
                                    <td>
                                        {exchangeRate.name
                                            .charAt(0)
                                            .toUpperCase() +
                                            exchangeRate.name.slice(1)}
                                    </td>
                                    <td>{exchangeRate.amount}</td>
                                    <td>{exchangeRate.shortName}</td>
                                    <td>
                                        {exchangeRate.currBuy.toLocaleString(
                                            undefined,
                                            {
                                                minimumFractionDigits: 3,
                                                maximumFractionDigits: 3,
                                            }
                                        )}
                                    </td>
                                    <td>
                                        {exchangeRate.currSell.toLocaleString(
                                            undefined,
                                            {
                                                minimumFractionDigits: 3,
                                                maximumFractionDigits: 3,
                                            }
                                        )}
                                    </td>
                                    <td>
                                        {exchangeRate.currMid.toLocaleString(
                                            undefined,
                                            {
                                                minimumFractionDigits: 3,
                                                maximumFractionDigits: 3,
                                            }
                                        )}
                                    </td>
                                    <td>
                                        {exchangeRate.cnbMid.toLocaleString(
                                            undefined,
                                            {
                                                minimumFractionDigits: 3,
                                                maximumFractionDigits: 3,
                                            }
                                        )}
                                    </td>
                                    <td>
                                        <span>
                                            {exchangeRate.move >= 0
                                                ? `+${exchangeRate.move.toLocaleString(
                                                      undefined,
                                                      {
                                                          minimumFractionDigits: 2,
                                                          maximumFractionDigits: 2,
                                                      }
                                                  )}`
                                                : exchangeRate.move.toLocaleString(
                                                      undefined,
                                                      {
                                                          minimumFractionDigits: 2,
                                                          maximumFractionDigits: 2,
                                                      }
                                                  )}
                                        </span>
                                        {exchangeRate.move === 0 ? (
                                            <span className="no-move">→</span>
                                        ) : exchangeRate.move > 0 ? (
                                            <span className="move-up">↗</span>
                                        ) : (
                                            <span className="move-down">↘</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="10">
                            Kurzy ze dne{" "}
                            {exchangeRates &&
                                exchangeRates[0] &&
                                DateTime.fromISO(
                                    exchangeRates[0].validFrom
                                ).toLocaleString()}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}
