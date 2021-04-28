from flask import current_app, Blueprint, request, \
    jsonify, session as login_session, Response
from app.db.crud import get_row_if_exists, add_user
from app.db.database_setup import User
from datetime import datetime
from app.util.util import *
from app.util.aws.s3 import upload_file_wname
import os
import random
import string

authetication = Blueprint("auth", __name__)


@authetication.route("/login", methods=["POST", "OPTIONS"])
def login():
    """Login function and create anti-forgery state token."""
    # first check if the domain is allowed
    if request.remote_addr not in current_app.config["ALLOWED_ORIGINS"]:
        json_response = {
            "message": "Invalid Domain. How did you find us???? HAHA. TROLLED. FOLLOW HOMEHUB @ LinkedIn"}
        response = generateResponse(json_response, 401)
        return response
    if request.method == "OPTIONS":
        return generateResponse()
    # if user has already logged in, tell them
    if isLoggedin(login_session):
        json_response = {"message": "You have already logged in"}
        response = generateResponse(json_response)
        return response
    access_token = "".join(random.choice(string.ascii_uppercase + string.digits)
                           for x in range(32))
    login_session["access_token"] = access_token
    # check requested json, see if the json contains required login info
    try:
        # check if json exists from request
        requested_json = request.json
        # check if json contains enough info
        # check if json contains valid info(ucsd email and google auth token)
    except:
        # if not, the request is invalid
        json_response = {
            "message": "the request doesn't contain json data"}
        response = generateResponse(json_response, 400)
        return response
     # check in with db to see if user is new
    session = current_app.config["DB_CONNECTION"]
    user = get_row_if_exists(
        User, session, **{"email": requested_json["email"]})
    if not user:
        # User doesn"t exist
        json_response = {"newUser": True}
        response = generateResponse(json_response)
        response.set_cookie("access_token", access_token)
        return response
    path_name = "/".join(["user"+str(user.id),
                          "profile", "headshot.jpg"])
    login_session["user_id"] = user.id
    json_response = {"name": requested_json["name"],
                     "email": requested_json["email"],
                     "access_token": access_token,
                     "message": "Successfully created room.",
                     "description": user.description,
                     "phone": user.phone,
                     "schoolYear": user.school_year,
                     "major": user.major,
                     "profile_photo": path_name
                     }
    response = generateResponse(json_response)
    response.set_cookie("access_token", access_token)
    return response


@authetication.route("/logout", methods=["POST", "OPTIONS"])
def logout():
    if request.method == "OPTIONS":
        return generateResponse()
    client_token = request.json.get("access_token")
    message, status = "Successful Logout!", 200
    # delete the user id
    if not client_token or (client_token != login_session["access_token"]):
        message, status = "Logout is Forbidden due to wrong token", 403
        print(client_token, login_session["access_token"])
    else:
        del login_session["user_id"]
        del login_session["access_token"]
    return generateResponse(elem=message, status=status)


@authetication.route("/createUser", methods=["POST", "OPTIONS"])
def create_user():
    # it assumes the user should already have an access token from login
    # so we check if there is an access token, if not, we reject the create user request
    session = current_app.config["DB_CONNECTION"]
    if request.method == "OPTIONS":
        return generateResponse()
    requested_json = request.json
    request_token = request.cookies.get('access_token')
    if not request_token or request_token != login_session["access_token"]:
        message, status = "Invalid Request", 400
        return generateResponse(elem=message, status=status)
    if get_row_if_exists(User, session, **{"email": requested_json["email"]}):
        message, status = "Already Created", 200
        return generateResponse(elem=message, status=status)

    user = add_user(requested_json["name"],
                    requested_json["email"],
                    datetime.now(),
                    requested_json["phone"],
                    requested_json["description"],
                    requested_json["schoolYear"],
                    requested_json["major"],
                    session)
    login_session["user_id"] = user.id
    icon_path = "./assets/profile_default_icons/"
    selected_icon = random.choice(
        os.listdir(icon_path))
    path_name = "/".join(["user"+str(user.id),
                          "profile", "headshot.jpg"])
    upload_file_wname(icon_path+selected_icon, "houseit", path_name)

    json_response = {"name": requested_json["name"],
                     "email": requested_json["email"],
                     "access_token": login_session["access_token"],
                     "message": "Successfully created room.",
                     "description": user.description,
                     "phone": user.phone,
                     "schoolYear": user.school_year,
                     "major": user.major,
                     "profile_photo": path_name
                     }
    response = generateResponse(json_response, 201)
    # response.set_cookie("access_token", login_session["access_token"])

    return response
