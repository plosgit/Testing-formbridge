echo "Starting client..." 
(cd client && npm run dev) &

echo "Starting server..."
(cd server && dotnet run) &

wait
