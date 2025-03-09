import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Define the application interface based on your actual schema
interface Application {
  _id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  formId: string;
  proposalId: string;
  isApproved: boolean;
  isRejected: boolean;
  isSubmitted: boolean;
  isPaid: boolean;
  submittedData: {
    Name?: string;
    About?: string;
    Gender?: string;
    DOB?: string;
    [key: string]: any;
  };
  __v: number;
}

// Define component props interface
interface ApplicationsGraphProps {
  applications: Application[];
}

const ApplicationsGraph: React.FC<ApplicationsGraphProps> = ({ applications }) => {
  // Define proper chart data type
  const [chartData, setChartData] = useState<ChartData<'line'>>({
    labels: [],
    datasets: []
  });
  const [totals, setTotals] = useState({
    totalApplications: 0,
    totalApproved: 0,
    totalRejected: 0
  });
  useEffect(() => {
    if (!applications || applications.length === 0) {
      console.log("No applications data");
      return;
    }

    
    // Process applications data
    const processData = () => {
      try {
        // Group applications by date
        const dateGroups: Record<string, { total: number; approved: number; rejected: number }> = {};
           
        // Calculate overall totals
        let totalApplications = 0;
        let totalApproved = 0;
        let totalRejected = 0;
        
        applications.forEach(app => {
          // Make sure createdAt is properly formatted
          if (!app.createdAt) {
            console.error("Application missing createdAt:", app);
            return;
          }
          
          // Convert createdAt to a date string (YYYY-MM-DD)
          const date = new Date(app.createdAt).toISOString().split('T')[0];
          console.log(date);
          
          if (!dateGroups[date]) {
            dateGroups[date] = {
              total: 0,
              approved: 0,
              rejected: 0
            };
          }
          
          dateGroups[date].total += 1;
          totalApplications += 1;
  
          if (app.isApproved) {
            dateGroups[date].approved += 1;
            totalApproved += 1;
          }
          
          if (app.isRejected) {
            dateGroups[date].rejected += 1;
            totalRejected += 1;
          }
          // Update totals state
        setTotals({
            totalApplications,
            totalApproved,
            totalRejected
          });
        });
        
        // Sort dates chronologically
        const sortedDates = Object.keys(dateGroups).sort((a, b) => 
          new Date(a).getTime() - new Date(b).getTime()
        );
        
        // Debug output
        console.log("Processed date groups:", dateGroups);
        console.log("Sorted dates:", sortedDates);
        
        // Prepare datasets
        const totalData = sortedDates.map(date => dateGroups[date].total);
        const approvedData = sortedDates.map(date => dateGroups[date].approved);
        const rejectedData = sortedDates.map(date => dateGroups[date].rejected);
        
        // Format dates for display (e.g., "Mar 8" instead of "2025-03-08")
        const formattedDates = sortedDates.map(date => {
          const d = new Date(date);
          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        
        console.log("Formatted dates:", formattedDates);
        console.log("Total data:", totalData);
        console.log("Approved data:", approvedData);
        console.log("Rejected data:", rejectedData);
        
        setChartData({
          labels: formattedDates,
          datasets: [
            {
              label: 'Total Applications',
              data: totalData,
              borderColor: 'rgb(54, 162, 235)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',

              tension: 0.1
            },
            {
              label: 'Approved',
              data: approvedData,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',


              tension: 0.1
            },
            {
              label: 'Rejected',
              data: rejectedData,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              tension: 0.1
            }
          ]
        });
      } catch (error) {
        console.error("Error processing application data:", error);
      }
    };
    
    processData();
  }, [applications]);

  // Define proper chart options type
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Applications Submitted",
        font: {
          size: 16
        }
      },
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0 // Only show whole numbers
        }
      }
    }
  };

  // If no data yet, show a loading message
  if (chartData.labels?.length === 0) {
    return <div className="w-full h-64 flex items-center justify-center">Loading chart data...</div>;
  }


  return (
    <div className="w-full">
      {/* Chart container */}
      <div className="w-full h-64 mb-4">
        <Line
          data={chartData}
          options={chartOptions}
        />
      </div>
      
      {/* Totals summary */}
      <div className="grid grid-cols-4 gap-4 mt-4">
       
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-sm text-gray-600">Total Applications</div>
          <div className="text-2xl font-bold text-blue-600">{totals.totalApplications}</div>
        </div>
        <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
          <div className="text-sm text-gray-600">Total Approved</div>
          <div className="text-2xl font-bold text-teal-600">{totals.totalApproved}</div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="text-sm text-gray-600">Total Rejected</div>
          <div className="text-2xl font-bold text-red-600">{totals.totalRejected}</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="text-sm text-gray-600">Total Pending</div>
          <div className="text-2xl font-bold text-yellow-600">{totals.totalApplications-totals.totalApproved-totals.totalRejected}</div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsGraph;