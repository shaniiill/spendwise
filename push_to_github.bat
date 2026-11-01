@echo off
title Push SpendWise to GitHub
set PATH=C:\Users\User\git\cmd;%PATH%
cd /d "c:\Users\User\Desktop\spendwise"
echo ========================================================
echo Pushing SpendWise to https://github.com/shaniiill/spendwise.git
echo ========================================================
echo.
git push -u origin main
echo.
pause
