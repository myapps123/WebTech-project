import React, { createContext, useState, useCallback } from 'react';
import axios from 'axios';

const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCourses = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const response = await axios.get('/api/courses', { params: filters });
      setCourses(response.data.courses);
      return response.data.courses;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data.categories);
      return response.data.categories;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <CourseContext.Provider value={{ courses, categories, loading, error, fetchCourses, fetchCategories }}>
      {children}
    </CourseContext.Provider>
  );
};

export default CourseContext;