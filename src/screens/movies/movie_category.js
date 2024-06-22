import React, { useState, useEffect } from "react";
import Navbar from "../../components/common/navbar/navbar";
import TableComp from "../../components/common/table/table";
import ModalComp from "../../components/common/modal/modal";
import MovieForm from "../../components/common/form/movie-form";
import ModalEdit from "../../components/common/modal/edit-modal";
import ConfirmModal from "../../components/common/modal/confirm-modal";
import CategoryRegisterForm from "../../components/common/form/category-register-form";

import { useDispatch, useSelector } from "react-redux";
import { listAllCategoryAndGenre, deleteCategory, listDetailCategory } from "../../actions/categoryAction";
import { Spin } from "antd";
import CategoryEditForm from "../../components/common/form/category-edit-form";


const MovieCategory = () => {
  const categoryTitle = "Category Register"
  const categoryEditTitle = "Category Update"
  const categorySearchTitle = "Category name";
  const [modalNew, setModalNew] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [categoryID, setCategoryID] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const CategoryList = useSelector(
    (state) => state.categoryGenreList?.categories
  );
  const CategoryDetailList = useSelector(
    (state) => state.categoryDetail?.category
  )
  const totalCategory = CategoryList?.filter((item) => item.kind === 0).length ;
  

  // Toggle modal
  const showUpModalNew = async () => {
    setModalNew(!modalNew);

  };

  const showUpModalEdit = () => {
    setModalEdit(!modalEdit);
  };

  const showUpModalDelete = () => {
    setModalDelete(!modalDelete);
  };

  // Generate custom Table

  const columns = [
    {
      title: "Category Name",
      dataIndex: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
    }
  ];

  // Logic Code
  // This useEffect active only in the first time
  useEffect(() => {
    dispatch(listAllCategoryAndGenre());

  }, []);

  // This useEffect active when isLoading varibale change
  useEffect(() => {
    if (isLoading) {
      
      const timer = setTimeout(() => {
        dispatch(listAllCategoryAndGenre());
        setIsLoading(false);
      }, 1000);
      

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const updateCategoryID = (id) => {
    setCategoryID(id);
    dispatch(listDetailCategory(id));
  };

  const loadingPage = () =>{
    setIsLoading(true);
    setCategoryID(null);
  }

  const deleteCategoryByID = (id) =>{
    dispatch(deleteCategory(id))
    setIsLoading(true)
    setModalDelete(false)
    setCategoryID(null)
  }

  const onReset = () =>{
    setModalNew(false)
    setModalEdit(false)
    setModalDelete(false)
    setCategoryID(null)
    setIsLoading(true)
  } 


  

  return (
    <>
      <Navbar
        searchTitle={categorySearchTitle}
        toggleNew={showUpModalNew}
        toggleEdit={showUpModalEdit}
        toggleDelete={showUpModalDelete}
        onReset={onReset}
        activeItem={categoryID}
      />

      {/* Modal New */}
      <ModalComp
        title={categoryTitle}
        isModal={modalNew}
        toggleNew={showUpModalNew}
        form={<CategoryRegisterForm toggleNew={showUpModalNew} onLoading={loadingPage} />}
      />

      {/* Modal Delete */}
       <ConfirmModal isModal={modalDelete} toggleModal={showUpModalDelete} onDelete={() => deleteCategoryByID(categoryID)}  />.

        {/* Modal  */}

      <ModalEdit title={categoryEditTitle} isModal={modalEdit} toggleEdit={showUpModalEdit} form={<CategoryEditForm isModal={modalEdit} toggleEdit={showUpModalEdit} onLoading={loadingPage} data={CategoryDetailList} />}/>
      

      <div className="mt-8">
      {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spin size="large" />
            </div>
          ) : (
            <TableComp
            data={CategoryList?.filter((item) => item.kind === 0)?.map(
              (item, index) => ({
                ...item,
                key: `category-${index}`,
              })
            )}
            columns={columns}
            selectedRow={updateCategoryID}
            totalItem={totalCategory}
          />
          )}
        
      </div>
    </>
  );
};

export default MovieCategory;
