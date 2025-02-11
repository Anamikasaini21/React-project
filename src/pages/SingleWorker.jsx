import React, { useEffect, useState } from 'react'
import axios from 'axios'
import FeedbackForm from '../components/FeedBackForm';
import { useSelector } from 'react-redux';
import { BsStarFill } from 'react-icons/bs';
import Input from '../components/Input';
import { Link } from 'react-router-dom';
import workers from '../constants';


//TODO: Implement SingleWorker
function SingleWorker() {
  //get workers[0] id from url
  const workerId = window.location.pathname.split("/")[2]
  const [worker, setWorker] = useState({});
  const { currentUser } = useSelector(state=>state.user)
  const date = new Date;
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState({
    message:'',
    date: String(date),
    userId: String(currentUser.user.id),
    workerId: workerId,
    username: currentUser.user.username,
  })

  const getWorkerById = async () => {
    try {
      const token = `Bearer ${currentUser.token}`;
      const res = await axios.get(`https://nexum-backend-production-486e.up.railway.app/api/workers[0]/show/getWorkerById/${workerId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + currentUser.token,
        },
      });
      setWorker(res.data.data[0])
    } catch (error) {
    }
  }

  const totalRating = (reviews) => {
    let totalRating = 0;
    let count = reviews.length;
    reviews.map((review) => {
      totalRating+=review.rating
    })
    return (totalRating/count).toFixed(2);
  }

  const handleMessageSubmit = () => {
    axios.post('https://nexum-backend-production-486e.up.railway.app/api/message/addMessage', message, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.token}`,
      }
    })
    .then((response) => {
      setMessage({});
      window.location.reload();
    })
    .catch((error) => {
    })
  
  }

  const [reviews, setReviews] = useState([{}]);
  const getAllReview = async () => {
    try {
      const token = `Bearer ${currentUser.token}`;
      const res = await axios.get(`https://nexum-backend-production-486e.up.railway.app/api/review/getReviewByWorkerId/${workerId}`,{
        headers: {
          'Authorization': String(token),
        },
      });
      setReviews(res.data.data);
    } catch (error) {
    }
  }

  const Rating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className="cursor-pointer">
          <BsStarFill className='text-yellow-300'/>
        </span>
      );
    }
    return stars;
  }
  
  useEffect(() => {
    getAllReview();
    getWorkerById();
  }, []);

  useEffect(() => {
    setRating(totalRating(reviews));
  }
  , [reviews]);

  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <h1 className='text-3xl text-center text-violet-900 font-bold py-6'>Personal Worker Portfolio</h1>
      <div className="container px-5 mx-auto">
        <div className="lg:w-full mx-auto flex flex-wrap">
          <div className="w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">{workers[0].userName}</h2>
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
              <span className='capitalize px-1'>{workers[0].firstName}</span>
              <span className='capitalize px-1'>{workers[0].middleName}</span>
              <span className='capitalize px-1'>{workers[0].lastName}</span>
            </h1>
            <div className="flex mb-4">
              <span className="flex items-center">
                <span className="text-gray-600 ml-3">Rating : {rating}</span>
              </span>
              <span className="flex ml-3 pl-3 py-2 border-l-2 border-gray-200 space-x-2s">
                <span className="text-gray-600 ml-3">Total Reviews : {reviews.length}</span>
              </span>
            </div>
            <div className='flex flex-row-reverse justify-between'>
            <div className='flex justify-center lg:gap-24 md:flex-row flex-col md:px-12 py-4 md:gap-12 gap-4 rounded-2xl mb-4 px-4'>
            <img alt="ecommerce" className="h-80 object-cover object-center rounded" src={workers[0].photoUrl} />
            </div>
            <div className="mt-6 items-center pb-5 border-b-2 border-gray-100 rounded-xl">
              <div className=''>
                <p className='text-lg font-semibold'>Skill : </p>
                <p className='px-4 text-gray-900'>{workers[0].skills}</p>
              </div>
              <div className=''>
                <p className='text-lg font-semibold'>Contact Details</p>
                <p className='px-4 text-gray-900'>{workers[0].email}</p>
                <p className='px-4 text-gray-900'>{workers[0].phoneNo}</p>
              </div>
              <div>
                <p className='text-lg font-semibold'>Address : </p>
                <p className='px-4 text-gray-900'>Local Address : {workers[0].address}</p>
                <p className='px-4 text-gray-900'>State : {workers[0].state} </p>
                <p className='px-4 text-gray-900'>City : {workers[0].city}</p>
                <p className='px-4 text-gray-900'>Country : {workers[0].country}</p>
              </div>
              <div>
                <p className='text-lg font-semibold'>Exprience : </p>
                <p className='px-4 text-gray-900'>{workers[0].experience}</p>
              </div>
              <div>
                <p className='text-lg font-semibold'>About : </p>
                <p className='px-4 text-gray-900 text-wrap'>{workers[0].about}</p>
              </div>
            </div>
            </div>
            <div className='pb-4'>
                <p className='text-lg font-semibold'>Reviews : </p>
                {reviews.map((review, index) => (
                  <div key={index} className='flex gap-2'>
                    <p className='px-4 text-gray-900'><span className='text-sm'>Comment : </span> {review.comment}</p>
                    <div className='flex gap-1 items-center'>Rating : {review.rating} {Rating(review.rating)}</div>
                  </div>
                ))}
                {reviews.length === 0 ? <p>Sorry... No reviews yet.</p> : ""}
            </div>
            <div className="relative mb-4">
              
              <p className='text-xl font-bold pb-4'>Send Message to Worker</p>
              <Link to={`http://localhost:9090`} className='text-2xl text-blue-600'>Send message</Link>
            </div>

          </div>
          
        </div>
        <div className='py-4 px-10'>
        <p className='py-4 font-bold text-xl'>Review</p>
        <FeedbackForm workerId={workerId} userId={currentUser.user.id}/>
        </div>
        <div className="flex gap-6 md:flex-row flex-col container px-5 py-24 mx-auto lg:w-4/5">
          <div className='sm:w-1/2 w-full'>
            
          </div>
        </div>
      </div>
    </section>
  )
}

export default SingleWorker;