import React from 'react'
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import CustomTooltip from './CustomTooltip';
import CustomLegend from './CustomLegend';



const CustomPieChart = ({
    data,
    label,
    totalAmount,
    colors,
    showTextAnchor
}) => {


    // Legend is rendered outside the SVG so the chart's centre is always the pie's centre,
    // however many lines the legend wraps to on narrow screens
    const legendPayload = data.map((entry, index) => ({
        value: entry.name,
        color: colors[index % colors.length],
    }));

    return (
        <div>
            <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="amount"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        // Percentages scale with the container, so the ring fits narrow cards
                        outerRadius="100%"
                        innerRadius="77%"
                        labelLine={false}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={CustomTooltip} />

                    {showTextAnchor && (
                        <>
                            <text
                                x="50%"
                                y="50%"
                                dy={-12}
                                textAnchor='middle'
                                fill="#666"
                                fontSize="14px"
                            >
                                {label}
                            </text>
                            <text
                                x="50%"
                                y="50%"
                                dy={22}
                                textAnchor='middle'
                                fill="#333"
                                fontSize="24px"
                                fontWeight="semi-bold"
                            >
                                {totalAmount}
                            </text>
                        </>
                    )}
                </PieChart>
            </ResponsiveContainer>
            <CustomLegend payload={legendPayload} />
        </div>
    )
};

export default CustomPieChart