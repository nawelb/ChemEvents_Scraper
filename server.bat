node indexSCF.js &
node betterConfSeriesData.js &

#start "scf" scf.bat
#timeout /t 60
#taskkill /F /FI "WINDOWTITLE eq scf - scf.bat" /T

#start "confSeries" confSeries.bat
#timeout /t 180
#taskkill /F /FI "WINDOWTITLE eq confSeries - confSeries.bat" /T