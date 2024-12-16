import os
import hashlib


class PasswordManager:
    @staticmethod
    def generate_salt() -> bytes:
        return os.urandom(16)

    @staticmethod
    def encode_password(pw: str, salt: bytes = None) -> bytes:
        if salt is None:
            salt = PasswordManager.generate_salt()
        return hashlib.pbkdf2_hmac("sha256", pw.encode("utf-8"), salt, 100000)

    @staticmethod
    def verify_password(stored_pw: str, prov_pw: str, salt: bytes) -> bool:
        hashed_pw = PasswordManager.encode_password(prov_pw, bytes.fromhex(salt))
        return stored_pw == hashed_pw.hex()
