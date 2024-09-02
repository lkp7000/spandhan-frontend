import React, { useEffect, useState } from 'react';
import { Form, useFormik } from 'formik';
import * as Yup from 'yup';
import { apiCreateDoctor } from '@/services/DoctorService';
import { getAllFacilities } from '@/services/HospitalAppointment';

const dropdownStyle = {
  width: '120px',
  padding: '8px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  cursor: 'pointer',
};

const hoverStyle = {
  backgroundColor: '#f5f5f5',
};



const DoctorForm: React.FC<{
  [x: string]: any; handleModalClose: () => void; demo: any
}> = (props) => {
  const { handleModalClose, demo } = props;
  const [facilities, setFacilities] = useState<any[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<string>('');
  const data = selectedFacility
  const formik = useFormik({

    initialValues: {
      id: '',
      firstName: '',
      lastName: '',
      age: '',
      qualification: '',
      contact: '',
      facilityId: '',
      email: '',
      gender: '',
      bloodGroup: '',
      identity: '',
      identityNumber: '',
      doctorFee: ''
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('First Name is required'),
      lastName: Yup.string().required('Last Name is required'),
      age: Yup.string().required('Age is required'),
      qualification: Yup.string().required('Qualification is required'),
      contact: Yup.string().required('Contact is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      gender: Yup.string().required('Gender is required'),
      bloodGroup: Yup.string().required('Blood Group is required'),
      identity: Yup.string().required('Identity is required'),
      identityNumber: Yup.string().when('identity', {
        then: Yup.string().required('Identity Number is required')
      }),
      facilityId: Yup.string().required('Select Facility is required')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await apiCreateDoctor(values);
        if (response.status === 200 || response.status === 201) {
          console.log('API response:', response.data);
          handleModalClose();
        } else {
          console.error('API error:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('API error:', error);
      }
    },
  });

  const fetchFacilities = async () => {
    try {
      const response = await getAllFacilities();
      const data: any = response.data;
      setFacilities(data);
    } catch (error) {
      console.error('Error fetching facilities:', error);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const handleFacilityChange = (event: any) => {
    const selectedValue = event.target.value;
    setSelectedFacility(selectedValue);

    if (selectedValue) {
      fetchFacilities();
    }
  };

  useEffect(() => {
    formik.setValues({

      firstName: demo?.doctorDto?.firstName || '',
      lastName: demo?.doctorDto?.lastName || '',
      age: demo?.doctorDto?.age || '',
      qualification: demo?.doctorDto?.qualification || '',
      contact: demo?.doctorDto?.contact || '',
      email: demo?.doctorDto?.email || '',
      gender: demo?.doctorDto?.gender || '',
      bloodGroup: demo?.doctorDto?.bloodGroup || '',
      identity: demo?.doctorDto?.identity || '',
      identityNumber: demo?.doctorDto?.identityNumber || '',
      doctorFee: demo?.doctorDto?.doctorFee || '',
      facility: demo?.doctorDto?.facility || '',
    });
  }, [demo]);

  const renderIdentityNumberInput = () => {
    if (
      (formik.values.identity === 'aadhar') ||
      formik.values.identity === 'voterId' ||
      formik.values.identity === 'pan' ||
      formik.values.identity === 'passport' ||
      formik.values.identity === 'drivingLicense' ||
      formik.values.identity === 'rationCard'
    ) {
      return (
        <div>
          <label htmlFor="identityNumber" style={{ display: 'block', marginBottom: '8px' }}>
            {formik.values.identity === 'aadhar'
              ? 'Aadhar Number:'
              : formik.values.identity === 'voterId'
                ? 'Voter ID Number:'
                : formik.values.identity === 'pan'
                  ? 'PAN Card Number:'
                  : formik.values.identity === 'passport'
                    ? 'Passport Number:'
                    : formik.values.identity === 'drivingLicense'
                      ? 'Driving License Number:'
                      : formik.values.identity === 'rationCard'
                        ? 'Ration Card Number:'
                        : ''}
          </label>
          <input
            id="identityNumber"
            name="identityNumber"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.identityNumber}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          {formik.touched.identityNumber && formik.errors.identityNumber ? (
            <div style={{ color: '#ff0000' }}>{formik.errors.identityNumber}</div>
          ) : null}
        </div>
      );
    }

  };


  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        formik.handleSubmit(e);
        handleModalClose();
      }}
      style={{
        width: '100%',
        margin: 'auto',
        padding: '10px',
        borderRadius: '8px',
        height: '30%'
      }}
    >
      <div className='flex '>
        <div style={{
          width: '45%',
          marginRight: '5%'
        }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '8px' }}>
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.firstName}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          {formik.touched.firstName && formik.errors.firstName ? (
            <div style={{ color: '#ff0000', marginTop: '5px', fontSize: '0.8em' }}>
              {formik.errors.firstName}
            </div>
          ) : null}
        </div>
        <div style={{
          width: '45%',
          marginRight: '5%'
        }}>
          <label htmlFor="lastName" style={{ display: 'block', marginBottom: '8px' }}>
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.lastName}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          {formik.touched.lastName && formik.errors.lastName ? (
            <div style={{ color: '#ff0000', marginTop: '5px', fontSize: '0.8em' }}>
              {formik.errors.lastName}
            </div>
          ) : null}
        </div>
        <div style={{
          width: '45%',

        }}>
          <label htmlFor="age" style={{ display: 'block', marginBottom: '8px' }}>
            Age
          </label>
          <input
            id="age"
            name="age"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.age}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          {formik.touched.age && formik.errors.age ? (
            <div style={{ color: '#ff0000', marginTop: '5px', fontSize: '0.8em' }}>
              {formik.errors.age}
            </div>
          ) : null}
        </div>

      </div>



      <div className='flex '>
        <div style={{ width: '38%', marginRight: '5%' }}>
          <label
            htmlFor="qualification"
            style={{ display: 'block', marginBottom: '8px' }}
          >
            Qualification
          </label>
          <input
            id="qualification"
            name="qualification"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.qualification}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          {formik.touched.qualification && formik.errors.qualification ? (
            <div style={{ color: '#ff0000', marginTop: '5px', fontSize: '0.8em' }}>
              {formik.errors.qualification}
            </div>
          ) : null}
        </div>
        <div style={{ width: '40%', marginRight: '5%' }}>

          <label htmlFor="contact" style={{ display: 'block', marginBottom: '8px' }}>
            Contact
          </label>
          <input
            id="contact"
            name="contact"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.contact}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          {formik.touched.contact && formik.errors.contact ? (
            <div style={{ color: '#ff0000', marginTop: '5px', fontSize: '0.8em' }}>
              {formik.errors.contact}
            </div>
          ) : null}
        </div>

        <div style={{ width: '40%' }}>
          <label
            htmlFor="gender"
            style={{ display: 'block', marginBottom: '8px' }}
          >
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.gender}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          >
            <option value="">Select </option>
            <option value="male">Male</option>
            <option value="female">Female</option>

          </select>
          {formik.touched.gender && formik.errors.gender ? (
            <div style={{ color: '#ff0000', marginTop: '5px', fontSize: '0.8em' }}>
              {formik.errors.gender}
            </div>
          ) : null}

        </div>
      </div>
      <div className='flex '>

        <div style={{ width: '30%', marginRight: '5%' }}>
          <label
            htmlFor="bloodGroup"
            style={{ display: 'block', marginBottom: '8px' }}
          >
            Blood Group
          </label>
          <select
            id="bloodGroup"
            name="bloodGroup"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.bloodGroup}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          >
            <option value="">Select Blood Group</option>
            <option value="O-negative">O -ve</option>
            <option value="O-positive">O +ve</option>
            <option value="A-negative">A -ve</option>
            <option value="A-positive">A +ve</option>
            <option value="B-negative">B -ve</option>
            <option value="B-positive">B +ve</option>
            <option value="AB-negative">AB -ve</option>
            <option value="AB-positive">AB +ve</option>
          </select>
          {formik.touched.bloodGroup && formik.errors.bloodGroup ? (
            <div style={{ color: '#ff0000', marginTop: '5px', fontSize: '0.8em' }}>
              {formik.errors.bloodGroup}
            </div>
          ) : null}

        </div>
        <div style={{ width: '40%', marginRight: '5%' }}>

          <label htmlFor="contact" style={{ display: 'block', marginBottom: '8px' }}>
            Doctor's Fee
          </label>
          <input
            id="doctorFee"
            name="doctorFee"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.doctorFee}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          {formik.touched.contact && formik.errors.contact ? (
            <div style={{ color: '#ff0000', marginTop: '5px', fontSize: '0.8em' }}>
              {formik.errors.doctorFee}
            </div>
          ) : null}
        </div>
        <div style={{ width: '30%', marginRight: '5%' }}>
          <label htmlFor="Facility" style={{ display: 'block', marginBottom: '8px' }}>
            Select Facility
          </label>
          <select
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
            id="facilityId"
            onChange={(event: any) => {
              formik.handleChange(event);
              const selectedFacility = facilities.find((item) => item.id === event.target.value);
              setSelectedFacility(selectedFacility?.facilityName || '');
            }}
            value={formik.values.facilityId}
          >
            <option value="">Select Facility</option>
            {facilities.map((item: any) => (
              <option key={item.id} value={item.id}>
                {item.facilityName}
              </option>
            ))}
          </select>
          {formik.errors.facilityId}

        </div>


        <div style={{ width: '30%' }}>
          <label htmlFor="identity" style={{ display: 'block', marginBottom: '8px' }}>
            Identity
          </label>
          <select
            id="identity"
            name="identity"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.identity}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          >
            <option value="">Select Identity</option>
            <option value="voterId">VoterId Card</option>
            <option value="pan">PAN Card</option>
            <option value="passport">Passport</option>
            <option value="drivingLicense">Driving License</option>
            <option value="rationCard">Ration Card</option>
          </select>
          {formik.touched.identity && formik.errors.identity ? (
            <div style={{ color: '#ff0000', marginTop: '5px', fontSize: '0.8em' }}>
              {formik.errors.identity}
            </div>
          ) : null}


          {renderIdentityNumberInput()}
        </div>

      </div>

      <div className="flex ">
        {/* ... (your existing form elements) ... */}
        <button
          type="button"
          style={{
            backgroundColor: '#3498db',
            color: 'white',
            padding: '5px 10px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '2%'
          }}
          onClick={() => {
            const payload = {
              id: demo?.id,
              firstName: formik?.values?.firstName,
              lastName: formik?.values?.lastName,
              age: formik?.values?.age,
              qualification: formik?.values?.qualification,
              contact: formik?.values?.contact,
              email: formik?.values?.email,
              gender: formik?.values?.gender,
              bloodGroup: formik?.values?.bloodGroup,
              identity: formik?.values?.identity,
              identityNumber: formik?.values?.identityNumber,
              doctorFee: formik?.values?.doctorFee,
              facilityId: formik?.values?.facilityId

            }
            props?.setDemo(payload)
            props.handleModalClose()
          }}
        >
          Submit
        </button>
        <button

          style={{
            backgroundColor: '#e74c3c',
            color: 'white',
            padding: '3px 10px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          onClick={() => {
            // Close the modal when "Cancel" is clicked
            props.handleModalClose();
          }}
        >
          Cancel

        </button>
      </div>
    </form>
  );
};

export default DoctorForm;
