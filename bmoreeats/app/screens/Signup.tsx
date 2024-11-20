import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; // Replace with React Native Icons
//  import CryptoJS from 'crypto-js';
import { useNavigation } from '@react-navigation/native';

const Signup: React.FC = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  
  const [otpData, setOtpData] = useState({ emailOtp: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (showOtpModal) {
      // Focus on OTP input if modal opens (not always necessary in React Native)
    }
  }, [showOtpModal]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === 'confirmPassword') setErrorMessage('');
  };

  const handleOtpChange = (value: string) => {
    setOtpData({ emailOtp: value });
  };

  const sendOtp = async () => {
    setIsLoading(true);
    try {
      await axios.post('http://10.1.10.171:8082/signup/send-otp', { email: formData.email });
      setOtpSent(true);
      setShowOtpModal(true);
      startResendTimer();
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      if (axios.isAxiosError(err)) {
        // Handle Axios error (e.g., server-side error with response data)
        setErrorMessage(err.response?.data || 'Error sending OTP');
      } else if (err instanceof Error) {
        // Handle generic JavaScript errors
        setErrorMessage(err.message);
      } else {
        setErrorMessage('An unknown error occurred');
      }
    }
  };

  const startResendTimer = () => {
    setCanResendOtp(false);
    setResendTimer(30);
    const timerInterval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev === 1) {
          clearInterval(timerInterval);
          setCanResendOtp(true);
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = () => {
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Confirm password does not match!');
      return;
    }
    setIsLoading(true);
    sendOtp();
  };

  const verifyOtp = async () => {
    setIsVerifying(true);
    try {
      const response = await axios.post('http://10.1.10.171:8082/signup/verify-otp', {
        email: formData.email,
        emailOtp: otpData.emailOtp,
      });
      if (response.data.verified) saveUser();
      else setOtpError('Invalid OTP! Please try again.');
    } catch (err) {
      setOtpError('OTP verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  //const secretKey = CryptoJS.enc.Utf8.parse('youwillneverknow');

  // const encryptPassword = (password: string) => {
  //   return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(password), secretKey, {
  //     mode: CryptoJS.mode.ECB,
  //     padding: CryptoJS.pad.Pkcs7,
  //   }).toString();
  // };

  const saveUser = async () => {
    try {
      await axios.post('http://10.0.0.171:8082/signup/register', {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        //password: encryptPassword(formData.password),
        password: formData.password
      });
      setShowOtpModal(false);
      setIsLoading(false);
      //navigation.navigate('Restaurants');
    } catch (err) {
      setIsLoading(false);
      if (axios.isAxiosError(err)) {
        setErrorMessage(err.response?.data || 'Registration failed');
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('An unknown error occurred');
      }
    }
  };

  const resendOtp = () => {
    if (canResendOtp) sendOtp();
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
      <Text style={styles.header}>B'MORE EATS 🍔</Text>
      <TextInput
        placeholder="Username"
        onChangeText={(value) => handleChange('username', value)}
        value={formData.username}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        onChangeText={(value) => handleChange('email', value)}
        value={formData.email}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Phone Number"
        onChangeText={(value) => handleChange('phone', value)}
        value={formData.phone}
        style={styles.input}
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry={!showPassword}
        onChangeText={(value) => handleChange('password', value)}
        value={formData.password}
        style={styles.input}
      />
      <TextInput
        placeholder="Confirm Password"
        secureTextEntry={!showConfirmPassword}
        onChangeText={(value) => handleChange('confirmPassword', value)}
        value={formData.confirmPassword}
        style={styles.input}
      />

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Send OTP</Text>
        )}
      </TouchableOpacity>

      {showOtpModal && (
        <View style={styles.otpModal}>
          <Text style={styles.modalText}>Enter OTP</Text>
          <TextInput
            placeholder="OTP"
            onChangeText={handleOtpChange}
            value={otpData.emailOtp}
            style={styles.input}
            keyboardType="number-pad"
          />
          {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}
          <TouchableOpacity onPress={verifyOtp} style={styles.button}>
            {isVerifying ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Verify OTP</Text>
            )}
          </TouchableOpacity>
          {canResendOtp && (
            <TouchableOpacity onPress={resendOtp}>
              <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      
 
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingHorizontal: 20,

  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#000000',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  otpModal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  resendText: {
    color: '#007BFF',
    marginTop: 10,
  },
});

export default Signup;
