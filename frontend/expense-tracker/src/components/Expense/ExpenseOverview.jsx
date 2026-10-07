import React, { useEffect, useState } from 'react'
import { LuPlus } from 'react-icons/lu'
import { prepareExpenseLineChartData } from '../../utils/helper';
import CustomLineChart from '../Charts/CustomLineChart';

const ExpenseOverview = ({transactions, onAddExpense}) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const result = prepareExpenseLineChartData(transactions);
        setChartData(result);

        return () => {};
    }, [transactions]);
  return (
    <div className='card'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
            <div className='min-w-0'>
                <h5 className='text-lg'>Expense Overview</h5>
                <p className='text-xs text-gray-400 mt-0.5'>
                    Track your spending trends over time and gain insights into your financial habits.
                </p>
            </div>

            <button className='add-btn self-start sm:self-auto' onClick={onAddExpense}>
                <LuPlus className='text-lg' />
                Add Expense
            </button>
        </div>

        <div className='mt-6 sm:mt-10'>
            <CustomLineChart data={chartData} />
        </div>
    </div>
  )
}

export default ExpenseOverview