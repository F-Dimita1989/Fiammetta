import os
import sys
import ctypes
from contextlib import contextmanager


def _null_log_callback(level, text, user_data):
    pass


def suppress_llama_logs():
    """Configures llama.cpp to suppress low-level C logging."""
    try:
        LOG_CALLBACK = ctypes.CFUNCTYPE(
            None, ctypes.c_int, ctypes.c_char_p, ctypes.c_void_p
        )
        c_log_callback = LOG_CALLBACK(_null_log_callback)
        import llama_cpp

        llama_cpp.llama_log_set(c_log_callback, ctypes.c_void_p())
    except Exception:
        pass


@contextmanager
def suppress_stdout_stderr():
    """Context manager to suppress stdout and stderr at the file descriptor level."""
    with open(os.devnull, "w") as devnull:
        try:
            old_stdout_fd = os.dup(sys.stdout.fileno())
            old_stderr_fd = os.dup(sys.stderr.fileno())
        except Exception:
            try:
                yield
            finally:
                pass
            return

        try:
            sys.stdout.flush()
            sys.stderr.flush()
            os.dup2(devnull.fileno(), sys.stdout.fileno())
            os.dup2(devnull.fileno(), sys.stderr.fileno())
            yield
        finally:
            sys.stdout.flush()
            sys.stderr.flush()
            os.dup2(old_stdout_fd, sys.stdout.fileno())
            os.dup2(old_stderr_fd, sys.stderr.fileno())
            os.close(old_stdout_fd)
            os.close(old_stderr_fd)
