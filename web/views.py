# coding=utf-8
import json
from datetime import datetime
import time
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.generic import TemplateView

from sqlalchemy import create_engine

engine = create_engine('postgres://zgzikcxqdqxxhz:59381b691d83aaf49569ef296b6e1ebc612f938954cb077783ad6f616e489820@ec2-23-23-225-12.compute-1.amazonaws.com:5432/dbn60sk0nc6tbg')
conn = engine.connect()

#User's Real Name, Date, Institution -How tables should be named


# Create your views here.
def index(request):
    # return HttpResponse('Hello from Python!')
    return render(request, 'index.html')

def PostCredentials(request):
    #http://localhost:5000/PostCredentials/username/password

    ABRV_table_name = str(request)[24:]
    ABRV_table_name = str(ABRV_table_name)[:-2]
    Password = ABRV_table_name.rsplit('/', 1)[-1] # password
    UserName = ABRV_table_name.rsplit('/', 2)[-2] # Username

    #Gets a list of all users who have made a todo list
    all_Tables = conn.execute('''SELECT * FROM "User Credentials";''')
    all_Tables_OBJ = all_Tables.cursor.fetchall()
    if UserName not in all_Tables_OBJ:
        conn.execute('''INSERT INTO "User Credentials" VALUES ('{}', '{}');'''.format(UserName, Password))
        return JsonResponse(UserName, safe=False)
    else:
        return JsonResponse('404', safe=False)

def GetCredentials(request):
    #http://localhost:5000/PostCredentials/cofax48/password

    ABRV_table_name = str(request)[24:]
    ABRV_table_name = str(ABRV_table_name)[:-2]
    Password = ABRV_table_name.rsplit('/', 1)[-1] # password
    UserName = ABRV_table_name.rsplit('/', 2)[-2] # Username

    Password_To_Use = conn.execute('''SELECT "Password" FROM "User Credentials" Where "UserName" = '{}';'''.format(UserName))
    Actual_Password = Password_To_Use.cursor.fetchall()[0][0]
    if str(Password) == str(Actual_Password):
        return JsonResponse(UserName, safe=False)


def graphingApp(request):
    return render(request, 'graphingApp.html')

def userList(request):
    #usersList/\w{2,30}/'
    ABRV_table_name = str(request)[24:]
    #institution = str(ABRV_table_name)[:-2]
    institution = 'Dr. Joyce Schenkein'

    query = conn.execute('''SELECT * FROM "Patient Names" WHERE "Institution" = '{}';'''.format(institution))
    query_list = query.cursor.fetchall()
    patient_name_and_trial_dates = []
    for patients in query_list:
        date_list = []
        for dates in patients:
            if '-' in str(dates):
                date_list.append(dates)

        patient_name_and_trial_dates.append({'Patient Name': patients[0], 'Trial Dates':date_list})

    return JsonResponse(patient_name_and_trial_dates, safe=False)


def get_Total_Trial_Num_For_Test_Date(request):
    #r'^api/\w{2,20}/\w{2,20}'
    #connect to database
    #preform query and return json data

    ABRV_table_name = str(request)[24:]
    ABRV_table_name = str(ABRV_table_name)[:-2]

    trial_date = ABRV_table_name.rsplit('/', 1)[-1] # table
    table_name = ABRV_table_name.rsplit('/', 2)[-2] # table
    table_name = table_name.replace('_', ' ')
    table_name = table_name.replace('_', ' ')

    name_date_trial = str(table_name) + ' ' + str(trial_date)

    query = conn.execute('''SELECT "Trial Number" FROM "{}" ORDER BY "Trial Number"::int DESC LIMIT 1;'''.format(name_date_trial))
    query_list = query.cursor.fetchall()


    return JsonResponse(query_list, safe=False)

def allTrialsFromSession(request):
    #http://localhost:5000/Josh_Schenkein/09-12-2017/

    ABRV_table_name = str(request)[24:]
    ABRV_table_name = str(ABRV_table_name)[:-2]

    trial_date = ABRV_table_name.rsplit('/', 1)[-1] # table
    table_name = ABRV_table_name.rsplit('/', 2)[-2] # table
    table_name = table_name.replace('_', ' ')
    table_name = table_name.replace('_', ' ')

    name_date_trial = str(table_name) + ' ' + str(trial_date)

    query = conn.execute('''SELECT * FROM "{}";'''.format(name_date_trial))
    query_list = query.cursor.fetchall()

    query_list_and_length = [len(query_list)] + query_list


    return JsonResponse(query_list_and_length, safe=False)

def get_Table_and_Column(request):
    #r'^api/\w{2,20}/\w{2,20}'
    #connect to database
    conn = engine.connect()
    #preform query and return json data

    ABRV_table_name = str(request)[24:]
    ABRV_table_name = str(ABRV_table_name)[:-2]

    trial_num = ABRV_table_name.rsplit('/', 1)[-1] # trial
    trial_date = ABRV_table_name.rsplit('/', 2)[-2] # table
    table_name = ABRV_table_name.rsplit('/', 3)[-3] # table
    table_name = table_name.replace('_', ' ')
    table_name = table_name.replace('_', ' ')

    name_date_trial = str(table_name) + ' ' + str(trial_date)

    query = conn.execute('''SELECT * FROM "{}" WHERE "Trial Number" = '{}';'''.format(name_date_trial, trial_num))
    query_list = query.cursor.fetchall()
    query_list_and_length = [len(query_list)] + query_list

    return JsonResponse(query_list_and_length, safe=False)
